/**
 * CardModal — manages the card-picker modal dialog.
 * Single responsibility: filter & display available cards for a given slot,
 * then call state.addCardToSlot when the player picks one.
 */

import { ScoringEngine } from '../scoring/ScoringEngine.js';

/** Normalises a card name / id to a snake_case key for comparisons. */
export function normalizeCardKey(value) {
    return String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/** Maps a CSS color name to its hex value for gradient swatches. */
export function mapColorNameToHex(colorName) {
    const palette = {
        blue: '#3b82f6', yellow: '#eab308', green: '#22c55e', red: '#ef4444',
        orange: '#f97316', lime: '#84cc16', brown: '#784828', silver: '#cbd5e1',
    };
    return palette[normalizeCardKey(colorName)] ?? '#cccccc';
}

/** Normalises a symbol label (filter checkbox value or JSON symbol string) for comparison. */
function normalizeSymbolKey(value) {
    const key = normalizeCardKey(value);
    const aliases = { paw: 'pawed_animal' };
    return aliases[key] ?? key;
}

/** Builds a CSS gradient string that represents a card's color split. */
function buildCardGradient(card, validSideData) {
    if (card.split_type === 'top_bottom') {
        const t = mapColorNameToHex(card.content.top?.colors?.[0]);
        const b = mapColorNameToHex(card.content.bottom?.colors?.[0]);
        return `background: linear-gradient(to bottom, ${t} 50%, ${b} 50%);`;
    }
    if (card.split_type === 'left_right') {
        const l = mapColorNameToHex(card.content.left?.colors?.[0]);
        const r = mapColorNameToHex(card.content.right?.colors?.[0]);
        return `background: linear-gradient(to right, ${l} 50%, ${r} 50%);`;
    }
    const c1 = mapColorNameToHex(validSideData.colors?.[0]);
    const c2 = validSideData.colors?.[1] ? mapColorNameToHex(validSideData.colors[1]) : c1;
    return `background: linear-gradient(135deg, ${c1} 50%, ${c2} 50%);`;
}

export class CardModal {
    /**
     * @param {import('../state/ForestState.js').ForestState} state
     * @param {() => Set<string>} getUsedFilenames  — returns filenames currently on the board
     */
    constructor(state, getUsedFilenames) {
        this.state = state;
        this.getUsedFilenames = getUsedFilenames;

        this.activeTreeId   = null;
        this.activeSlot     = null;
        this.activeMode     = 'default'; // 'default' | 'commonToadExtra' | 'europeanHareExtra'

        this._el      = document.getElementById('card-modal');
        this._list    = document.getElementById('modal-card-list');
        this._search  = document.getElementById('card-search');

        this._bindListeners();
    }

    _bindListeners() {
        document.getElementById('close-modal').addEventListener('click', () => this.close());
        this._search.addEventListener('input', () => this.renderList());
        document.querySelectorAll('.color-filter-cb').forEach(cb => {
            cb.addEventListener('change', () => this.renderList());
        });
        document.querySelectorAll('#modal-symbol-filters input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => this.renderList());
        });
    }

    /** Opens the modal for a normal slot pick. */
    open(treeId, slot) {
        this.activeTreeId = treeId;
        this.activeSlot   = slot;
        this.activeMode   = 'default';
        this._clearSearch();
        this.renderList();
        this._el.classList.remove('hidden');
    }

    /** Opens the modal specifically for adding the second Common Toad to a bottom slot. */
    openCommonToadExtra(treeId) {
        this.activeTreeId = treeId;
        this.activeSlot   = 'bottom';
        this.activeMode   = 'commonToadExtra';
        this._clearSearch();
        this.renderList();
        this._el.classList.remove('hidden');
    }

    /** Opens the modal for the stacking European Hare pick. */
    openEuropeanHareExtra(treeId, slot) {
        this.activeTreeId = treeId;
        this.activeSlot   = slot;
        this.activeMode   = 'europeanHareExtra';
        this._clearSearch();
        this.renderList();
        this._el.classList.remove('hidden');
    }

    close() {
        this._el.classList.add('hidden');
        this.activeMode = 'default';
    }

    _clearSearch() {
        this._search.value = '';
    }

    /** Rebuilds the card list inside the modal based on current search/filter state. */
    renderList() {
        this._list.innerHTML = '';
        if (!window.MasterDeck?.deck) return;

        const filterText      = this._search.value.toLowerCase();
        const selectedColors  = Array.from(document.querySelectorAll('.color-filter-cb:checked'))
            .map(cb => cb.value.toLowerCase());
        const selectedSymbols = Array.from(document.querySelectorAll('#modal-symbol-filters input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        const usedFilenames  = this.getUsedFilenames();

        window.MasterDeck.deck.forEach(card => {
            const { validSideData, folderMap } = this._resolveSlotContent(card);
            if (!validSideData) return;
            if (!validSideData.name.toLowerCase().includes(filterText)) return;
            if (!this._passesRepeatabilityCheck(card, validSideData, usedFilenames)) return;
            if (!this._passesColorFilter(validSideData, selectedColors)) return;
            if (!this._passesSymbolFilter(validSideData, selectedSymbols)) return;

            const btn = this._buildCardButton(card, validSideData, folderMap);
            this._list.appendChild(btn);
        });
    }

    // ── Private helpers ───────────────────────────────────────────────────

    /**
     * Returns { validSideData, folderMap } for the card in the active slot context,
     * or { validSideData: null } if the card doesn't belong in the current slot.
     */
    _resolveSlotContent(card) {
        const nk = normalizeCardKey;
        const mode = this.activeMode;
        const slot = this.activeSlot;

        if (mode === 'commonToadExtra') {
            if (card.split_type === 'top_bottom' && nk(card.content?.bottom?.name) === 'common_toad')
                return { validSideData: card.content.bottom, folderMap: 'top_bottom' };
            return { validSideData: null };
        }

        if (mode === 'europeanHareExtra') {
            if (card.split_type === 'left_right' && (slot === 'left' || slot === 'right')
                    && nk(card.content?.[slot]?.name) === 'european_hare')
                return { validSideData: card.content[slot], folderMap: 'left_right' };
            return { validSideData: null };
        }

        // Default mode
        if (slot === 'species' && card.split_type === 'trees')
            return { validSideData: card.content.tree, folderMap: 'tree' };
        if (card.split_type === 'left_right' && (slot === 'left' || slot === 'right'))
            return { validSideData: card.content[slot], folderMap: 'left_right' };
        if (card.split_type === 'top_bottom' && (slot === 'top' || slot === 'bottom'))
            return { validSideData: card.content[slot], folderMap: 'top_bottom' };

        return { validSideData: null };
    }

    /**
     * Returns false if this card's normalised ID is already on the board
     * and the card type is not legitimately stackable.
     *
     * Repeatable types (multiple physical copies exist in the real game):
     *   - tree species (4× Beech, 2× Birch, etc.)
     *   - Common Toad (special pair mechanic, handled via openCommonToadExtra)
     *   - European Hare (stacking mechanic, handled via openEuropeanHareExtra)
     *   - Butterflies (one per species per set; multiple sets possible)
     *   - Bats (four different species, each stackable in side slots)
     */
    _passesRepeatabilityCheck(card, validSideData, usedCardIds) {
        if (this.activeMode !== 'default') return true;

        const id = normalizeCardKey(validSideData.name);
        if (!usedCardIds.has(id)) return true;

        const isTree = card.split_type === 'trees' || this.activeSlot === 'species';
        const isStackable = ['common_toad', 'european_hare'].includes(id)
            || id.includes('butterfly') || id.includes('_bat') || id.includes('bat_');
        const isButterflyByName = ['purple_emperor', 'camberwell_beauty', 'large_tortoiseshell',
            'peacock_butterfly', 'silver_washed_fritillary'].includes(id);

        return isTree || isStackable || isButterflyByName;
    }

    _passesColorFilter(validSideData, selectedColors) {
        if (selectedColors.length === 0) return true;
        const cardColors = (validSideData.colors ?? []).map(c => c.toLowerCase());
        return selectedColors.some(c => cardColors.includes(c));
    }

    _passesSymbolFilter(validSideData, selectedSymbols) {
        if (selectedSymbols.length === 0) return true;
        const cardSymbols = (validSideData.symbols ?? []).map(normalizeSymbolKey);
        return selectedSymbols.some(s => cardSymbols.includes(normalizeSymbolKey(s)));
    }

    _buildCardButton(card, validSideData, folderMap) {
        const gradientStyle = buildCardGradient(card, validSideData);

        // Color-swatch modifier: overlays the image on the left (top/bottom cards)
        // or along the bottom edge (left/right cards).
        const swatchMod = card.split_type === 'top_bottom' ? 'colors--left-edge'
            : card.split_type === 'left_right'            ? 'colors--bottom-edge'
            : 'colors--bar';

        const btn = document.createElement('button');
        btn.className = 'modal-card-btn';
        btn.innerHTML = `
            <div class="modal-card-img-wrap">
                <img src="Assetes/Images/Cards/${folderMap}/${card.filename}" class="modal-card-img" onerror="this.style.display='none'">
                <div class="modal-card-colors ${swatchMod}" style="${gradientStyle}"></div>
            </div>
            <span>${validSideData.name}</span>
        `;
        btn.onclick = () => this._onCardSelected(card, validSideData, folderMap);
        return btn;
    }

    _onCardSelected(card, validSideData, folderMap) {
        if (this.activeMode === 'commonToadExtra') {
            const tree = this.state.trees.find(t => t.id === this.activeTreeId);
            const toadCount = (tree?.bottom ?? []).filter(c =>
                normalizeCardKey(c.cardId || c.name) === 'common_toad'
            ).length;
            if (toadCount >= 2) { this.close(); return; }
        }

        // CommonToad and EuropeanHare use allowStack=true because those cards
        // can coexist in the same slot (game rules exception).
        const isStack = this.activeMode === 'commonToadExtra' || this.activeMode === 'europeanHareExtra';

        const meta = ScoringEngine.resolveCardMeta(this.activeSlot, validSideData.name);
        this.state.addCardToSlot(this.activeTreeId, this.activeSlot, {
            filename:  card.filename,
            folder:    folderMap,
            name:      validSideData.name,
            colors:    validSideData.colors ?? [],
            cardId:    meta.cardId,
            symbols:   validSideData.symbols ?? [],
            ruleType:  meta.ruleType,
        }, isStack);
        this.close();
    }
}

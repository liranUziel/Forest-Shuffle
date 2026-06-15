/**
 * UIManager — renders the game board and wires user interactions to state.
 * Single responsibility: translate ForestState into DOM and delegate user
 * actions (open modal, remove card, add tree, toggle flags) back to state.
 */

import { ScoringEngine } from '../scoring/ScoringEngine.js';
import { CardModal, normalizeCardKey, mapColorNameToHex } from './CardModal.js';

export class UIManager {
    /**
     * @param {import('../state/ForestState.js').ForestState} state
     * @param {string} containerId  — id of the root DOM element for tree cards
     */
    constructor(state, containerId) {
        this.state     = state;
        this.container = document.getElementById(containerId);
        this.isScoreBreakdownCollapsed = true;

        this.modal = new CardModal(state, () => this._getUsedCardFilenames());

        this._setupStaticListeners();
        state.subscribe((trees, total) => this.render(trees, total));
        this.render(state.trees ?? [], 0);
    }

    // ── Static listener setup (once on construction) ──────────────────────

    _setupStaticListeners() {
        document.getElementById('clear-save-btn')?.addEventListener('click', () => this.state.resetGame());

        const caveButtons = {
            'cave-minus-10': -10, 'cave-minus-1': -1,
            'cave-plus-1':    +1, 'cave-plus-10': +10,
        };
        for (const [id, delta] of Object.entries(caveButtons)) {
            document.getElementById(id)?.addEventListener('click', () => this.state.updateCaveScore(delta));
        }
    }

    // ── Score breakdown panel ─────────────────────────────────────────────

    /** Creates (once) or updates the score breakdown panel below the header. */
    renderScoreBreakdown(trees) {
        let panel = document.getElementById('score-breakdown');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'score-breakdown';
            panel.className = 'score-breakdown';
            const header = document.querySelector('header');
            (header ?? this.container).insertAdjacentElement(header ? 'afterend' : 'beforebegin', panel);
        }

        const items = this.state.lastScoreBreakdown ?? [];
        const byTree = new Map();
        items.forEach(item => {
            if (!byTree.has(item.treeId)) byTree.set(item.treeId, []);
            byTree.get(item.treeId).push(item);
        });

        const groups = trees.map((tree, i) => {
            const rows = (byTree.get(tree.id) ?? []).map(item => {
                const sign = item.points >= 0 ? '+' : '';
                const statusCls = item.calculated ? 'ok' : 'missing';
                return `<div class="score-row">
                    <span class="score-card">${item.cardName}</span>
                    <span class="score-meta">${item.slot} • ${item.ruleType ?? 'NONE'} • ${item.detail}</span>
                    <span class="score-points">${sign}${item.points}</span>
                    <span class="score-status ${statusCls}">${item.calculated ? 'CALC' : 'MISS'}</span>
                </div>`;
            }).join('');
            const treeTotal = this.state.lastTreeScores[tree.id] ?? 0;
            return `<div class="score-tree-group">
                <div class="score-tree-title">Tree ${i + 1} Total: ${treeTotal}</div>
                <div class="score-tree-list">${rows || '<div class="score-empty">No cards on this tree.</div>'}</div>
            </div>`;
        }).join('');

        const expanded = !this.isScoreBreakdownCollapsed;
        panel.innerHTML = `
            <div class="score-breakdown-header">
                <button class="score-breakdown-toggle" type="button" aria-expanded="${expanded}">
                    ${expanded ? 'Hide' : 'Show'} Score Breakdown (${items.length} cards)
                </button>
            </div>
            <div class="score-breakdown-content ${expanded ? 'expanded' : 'collapsed'}">
                <div class="score-breakdown-list">${groups || '<div class="score-empty">No cards on board.</div>'}</div>
            </div>
        `;

        panel.querySelector('.score-breakdown-toggle').addEventListener('click', () => {
            this.isScoreBreakdownCollapsed = !this.isScoreBreakdownCollapsed;
            this.renderScoreBreakdown(trees);
        });
    }

    // ── Slot rendering ────────────────────────────────────────────────────

    /** Builds the HTML for one card slot (species / top / bottom / left / right). */
    renderSlot(tree, slotName) {
        const cards = slotName === 'species'
            ? (tree.species ? [tree.species] : [])
            : (tree[slotName] ?? []);

        if (cards.length === 0) {
            // Non-species slots require a species card to be present first.
            const canAdd = slotName === 'species' || tree.species !== null;
            const btn = canAdd
                ? `<button class="add-btn small-add" data-tree="${tree.id}" data-slot="${slotName}">+</button>`
                : `<button class="add-btn small-add locked" disabled title="Plant a tree first">+</button>`;
            return `<div class="slot-cards"></div>${btn}`;
        }

        const topIndex = cards.length - 1;
        const cardData = cards[topIndex];

        const badges   = this._buildSlotBadges(tree, slotName, cards, cardData, topIndex);
        const extras   = this._buildSlotExtras(tree, slotName, cards, cardData, topIndex);
        const sidePrev = (slotName === 'left' || slotName === 'right') ? this._buildSideStackPreview(cards, slotName) : '';
        const borderStyle = this._getButterflyBorderStyle(slotName, cardData);
        const animCls  = cardData.playedAnimation === false ? 'planting-animation' : 'card-animated';
        if (cardData.playedAnimation === false) cardData.playedAnimation = true;

        const sideLayerCls = (slotName === 'left' || slotName === 'right') ? 'side-main-layer' : '';

        return `<div class="slot-cards">
            <div class="mini-card image-card ${animCls}" style="${borderStyle}" data-tree="${tree.id}" data-slot="${slotName}" data-index="${topIndex}">
                ${sidePrev}
                <img src="Assetes/Cards/${cardData.folder}/${cardData.filename}" class="card-img split-${slotName} ${sideLayerCls}">
                ${badges}
                ${extras}
                <span class="delete-x">×</span>
            </div>
        </div>`;
    }

    /** Stack-count badge + score badge for a slot. */
    _buildSlotBadges(tree, slotName, cards, cardData, topIndex) {
        const stackBadge = cards.length > 1 ? `<span class="stack-badge">x${cards.length}</span>` : '';

        const isSide    = ['top', 'bottom', 'left', 'right'].includes(slotName);
        const isSpecies = slotName === 'species';

        let scoreBadge = '';
        if (isSide) {
            const total = cards.reduce(
                (sum, c) => sum + ScoringEngine.evaluateDetailed(c, this.state.trees, tree).points, 0
            );
            scoreBadge = `<span class="card-score-badge">${total}</span>`;
        } else if (isSpecies) {
            const pts = this.state.lastTreeSpeciesScores[tree.id] ?? 0;
            scoreBadge = `<span class="card-score-badge">${pts}</span>`;
        }

        return stackBadge + scoreBadge;
    }

    /** Special-card overlays: Common Toad add-button, European Hare add-button, Most checkboxes. */
    _buildSlotExtras(tree, slotName, cards, cardData, topIndex) {
        const nk = normalizeCardKey;
        const cardNorm = nk(cardData.cardId || cardData.name);
        let html = '';

        // Common Toad: allow adding a second copy to the same bottom slot
        if (slotName === 'bottom' && cardNorm === 'common_toad') {
            const toadCount = tree.bottom.filter(c => nk(c.cardId || c.name) === 'common_toad').length;
            if (toadCount === 1)
                html += `<button class="common-toad-add-btn" style="position:absolute;top:4px;right:28px;width:20px;height:20px;z-index:5" data-tree="${tree.id}">+</button>`;
        }

        // European Hare: show current total count next to the add button
        if ((slotName === 'left' || slotName === 'right') && cardNorm === 'european_hare') {
            const hareCount = this.state.trees.reduce((n, t) =>
                n + ['left', 'right'].reduce((m, s) => m + (t[s] ?? []).filter(c => nk(c.cardId || c.name) === 'european_hare').length, 0), 0);
            html += `<button class="european-hare-add-btn" data-tree="${tree.id}" data-slot="${slotName}">+ [${hareCount}]</button>`;
        }

        // Great Spotted Woodpecker: "Most Trees" toggle
        if ((slotName === 'top' || slotName === 'bottom') && cardNorm === 'great_spotted_woodpecker')
            html += `<label class="linden-most-label" style="top:25px"><input type="checkbox" class="most-toggle" data-tree="${tree.id}" data-slot="${slotName}" data-index="${topIndex}" data-flag="hasMost" ${cardData.hasMost ? 'checked' : ''}> Most Trees</label>`;

        // Linden: "Most" toggle on the species slot
        if (slotName === 'species' && cardNorm === 'linden')
            html += `<label class="linden-most-label"><input type="checkbox" class="most-toggle" data-tree="${tree.id}" data-flag="hasLindenMost" ${cardData.hasLindenMost ? 'checked' : ''}> Most</label>`;

        return html;
    }

    /** Returns a CSS border style if the card is a butterfly (colour-coded by set). */
    _getButterflyBorderStyle(slotName, cardData) {
        if (!(slotName === 'top' || slotName === 'bottom')) return '';
        if (!cardData.name?.toLowerCase().includes('butterfly')) return '';

        const boardObj = ScoringEngine.getAllCardsObject(this.state.trees);
        const { cardToSetMap } = ScoringEngine.getButterflySetMapping(boardObj);
        const setInfo = cardToSetMap.get(cardData);
        if (!setInfo) return '';

        const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
        const c = colors[setInfo.setIndex % colors.length];
        return `border: 4px solid ${c}; border-radius: 8px; box-sizing: border-box;`;
    }

    /** Stacked-card preview layers for side slots (shows hidden cards beneath the top one). */
    _buildSideStackPreview(cards, slotName) {
        if (cards.length <= 1) return '';
        return `<div class="side-stack-preview">${
            cards.slice(0, -1).reverse().map((card, i) => {
                const color = normalizeCardKey(this._getPrimaryDisplayColor(card, slotName));
                const chip  = color ? `<span class="side-stack-color-chip" data-color="${color}" title="${color}"></span>` : '';
                return `<div class="side-stack-layer-wrap" style="--stack-index:${i + 1}">
                    <img src="Assetes/Cards/${card.folder}/${card.filename}" class="card-img side-stack-layer split-${slotName}" alt="${card.name}">
                    ${chip}
                </div>`;
            }).join('')
        }</div>`;
    }

    // ── Colour helpers ────────────────────────────────────────────────────

    _getSpeciesTreeColor(cardData) {
        const speciesColors = {
            beech: 'green', birch: 'lime', silver_birch: 'lime', oak: 'brown',
            linden: 'yellow', douglas_fir: 'silver', horse_chestnut: 'orange',
            silver_fir: 'blue', sycamore: 'red',
        };
        return speciesColors[normalizeCardKey(cardData?.cardId || cardData?.name)] ?? '';
    }

    /** Lazy fallback: scans window.MasterDeck to get the first color of any card by id. */
    _getFallbackColorByCard(cardData) {
        const cardId = normalizeCardKey(cardData?.cardId || cardData?.name);
        if (!cardId) return '';

        if (!this._cardFallbackColorsById) {
            const fallback = {};
            (window.MasterDeck?.deck ?? []).forEach(card => {
                const register = (side) => {
                    if (!side?.name || !side.colors?.length) return;
                    const key = normalizeCardKey(side.name);
                    fallback[key] ??= String(side.colors[0]);
                };
                if (card.split_type === 'left_right') {
                    register(card.content?.left);
                    register(card.content?.right);
                } else if (card.split_type === 'top_bottom') {
                    register(card.content?.top);
                    register(card.content?.bottom);
                }
            });
            this._cardFallbackColorsById = fallback;
        }
        return this._cardFallbackColorsById[cardId] ?? '';
    }

    _getPrimaryDisplayColor(cardData, slotName) {
        const colors = (cardData?.colors ?? []).filter(c => String(c ?? '').trim());
        if (colors.length > 0) return String(colors[0]);
        return slotName === 'species'
            ? this._getSpeciesTreeColor(cardData)
            : this._getFallbackColorByCard(cardData);
    }

    /** Returns a Set of normalised card IDs already placed on the board. */
    _getUsedCardFilenames() {
        const used = new Set();
        this.state.trees.forEach(tree => {
            const add = c => { if (c) used.add(normalizeCardKey(c.cardId || c.name)); };
            add(tree.species);
            ['top', 'bottom', 'left', 'right'].forEach(slot => (tree[slot] ?? []).forEach(add));
        });
        return used;
    }

    // ── Full board render ─────────────────────────────────────────────────

    /** Rebuilds the entire board DOM, then attaches event listeners. */
    render(trees, totalScore) {
        this.container.innerHTML = '';

        trees.forEach(tree => {
            const isEmpty = !tree.species && ['top','bottom','left','right'].every(s => !tree[s]?.length);
            const cluster = document.createElement('div');
            cluster.className = 'tree-cluster';
            cluster.innerHTML = `
                <div class="slot slot-top">${this.renderSlot(tree, 'top')}</div>
                <div class="slot slot-left">${this.renderSlot(tree, 'left')}</div>
                <div class="slot slot-center">${this.renderSlot(tree, 'species')}</div>
                <div class="slot slot-right">${this.renderSlot(tree, 'right')}</div>
                <div class="slot slot-bottom">${this.renderSlot(tree, 'bottom')}</div>
                ${isEmpty ? `<div class="tree-controls"><button class="danger-btn delete-tree-btn" data-tree="${tree.id}">Delete Tree</button></div>` : ''}
            `;
            cluster.querySelector('.delete-tree-btn')?.addEventListener('click', e => {
                e.stopPropagation();
                this.state.removeTree(tree.id);
            });
            this.container.appendChild(cluster);
        });

        const addBtn = document.createElement('button');
        addBtn.id        = 'add-tree-btn';
        addBtn.className = 'add-btn large-add';
        addBtn.innerText = '+ Plant New Tree';
        addBtn.addEventListener('click', () => this.state.addTree());
        this.container.appendChild(addBtn);

        document.getElementById('total-score-display').innerText = `Total Score: ${totalScore}`;
        const caveDisplay = document.getElementById('cave-val');
        if (caveDisplay) caveDisplay.innerText = `Cave: ${this.state.caveCount}`;

        this.renderScoreBreakdown(trees);
        this._attachBoardListeners();
    }

    /** Attaches delegated event listeners to every interactive element on the board. */
    _attachBoardListeners() {
        // Open modal on "+" slot buttons (disabled/locked buttons are skipped)
        this.container.querySelectorAll('.small-add:not([disabled])').forEach(btn =>
            btn.addEventListener('click', e => this.modal.open(e.target.dataset.tree, e.target.dataset.slot))
        );

        // Remove card on "×" buttons
        this.container.querySelectorAll('.delete-x').forEach(btn =>
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const card = e.currentTarget.closest('.image-card');
                if (!card) return;
                const { tree: treeId, slot, index } = card.dataset;
                const tree = this.state.trees.find(t => t.id === treeId);
                // Species slot: use stored index; side slots: always remove last (top of stack)
                const idx = (slot === 'species') ? Number(index)
                    : Math.max(0, (tree?.[slot]?.length ?? 1) - 1);
                this.state.removeCardFromSlot(treeId, slot, idx);
            })
        );

        // Common Toad extra-card button
        this.container.querySelectorAll('.common-toad-add-btn').forEach(btn =>
            btn.addEventListener('click', e => {
                e.stopPropagation();
                this.modal.openCommonToadExtra(e.currentTarget.dataset.tree);
            })
        );

        // European Hare extra-card button
        this.container.querySelectorAll('.european-hare-add-btn').forEach(btn =>
            btn.addEventListener('click', e => {
                e.stopPropagation();
                this.modal.openEuropeanHareExtra(e.currentTarget.dataset.tree, e.currentTarget.dataset.slot);
            })
        );

        // "Most" toggle checkboxes (Linden / Great Spotted Woodpecker)
        this.container.querySelectorAll('.most-toggle').forEach(input =>
            input.addEventListener('change', e => {
                e.stopPropagation();
                const { tree: treeId, slot, index, flag } = e.currentTarget.dataset;
                const patch = { [flag]: !!e.currentTarget.checked };
                if (slot && index !== undefined) {
                    this.state.updateCardMeta(treeId, slot, Number(index), patch);
                } else {
                    this.state.updateSpeciesCardMeta(treeId, patch);
                }
            })
        );
    }
}

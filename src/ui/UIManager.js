import { ScoringEngine } from "../scoring/ScoringEngine.js";

export class UIManager {
    constructor(state, containerId) {
        this.state = state;
        this.container = document.getElementById(containerId);
        this.modal = document.getElementById('card-modal');
        this.searchInput = document.getElementById('card-search');
        this.activeTreeId = null;
        this.activeSlot = null;
        this.activeModalMode = 'default';
        this.isScoreBreakdownCollapsed = true;
        this.setupModalListeners();
        this.state.subscribe((trees, total) => this.render(trees, total));
    }
    setupModalListeners() {
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        this.searchInput.addEventListener('input', (e) => this.renderModalList(e.target.value));
        document.getElementById('clear-save-btn').addEventListener('click', () => this.state.resetGame());
    }
    openModal(treeId, slot) { this.activeTreeId = treeId; this.activeSlot = slot; this.activeModalMode = 'default'; this.renderModalList(); this.modal.classList.remove('hidden'); }
    openCommonToadExtraModal(treeId) { this.activeTreeId = treeId; this.activeSlot = 'bottom'; this.activeModalMode = 'commonToadExtra'; this.renderModalList(); this.modal.classList.remove('hidden'); }
    openEuropeanHareExtraModal(treeId, slot) { this.activeTreeId = treeId; this.activeSlot = slot; this.activeModalMode = 'europeanHareExtra'; this.renderModalList(); this.modal.classList.remove('hidden'); }
    closeModal() { this.modal.classList.add('hidden'); this.activeModalMode = 'default'; }

    normalizeCardKey(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    isCommonToadCard(cardData) {
        if (!cardData) return false;
        const normalized = this.normalizeCardKey(cardData.cardId || cardData.name);
        return normalized === 'common_toad';
    }

    isEuropeanHareCard(cardData) {
        if (!cardData) return false;
        const normalized = this.normalizeCardKey(cardData.cardId || cardData.name);
        return normalized === 'european_hare';
    }

    getEuropeanHareCount() {
        let count = 0;
        this.state.trees.forEach((tree) => {
            ['left', 'right'].forEach((slot) => {
                (tree[slot] || []).forEach((card) => {
                    if (this.isEuropeanHareCard(card)) count += 1;
                });
            });
        });
        return count;
    }

    buildSideStackPreviewHtml(cards, slotName) {
        if (!Array.isArray(cards) || cards.length <= 1) return '';
        const hiddenCards = cards.slice(0, -1).reverse();
        const layers = hiddenCards.map((card, index) => {
            const stackIndex = index + 1;
            const primaryColor = this.getPrimaryDisplayColor(card, slotName);
            const normalizedColor = this.normalizeCardKey(primaryColor);
            const colorChip = normalizedColor
                ? `<span class="side-stack-color-chip" data-color="${normalizedColor}" title="${primaryColor}"></span>`
                : '';
            return `<div class="side-stack-layer-wrap" style="--stack-index:${stackIndex};"><img src="Assetes/Cards/${card.folder}/${card.filename}" class="card-img side-stack-layer split-${slotName}" alt="${card.name}">${colorChip}</div>`;
        }).join('');
        return layers ? `<div class="side-stack-preview">${layers}</div>` : '';
    }

    getSpeciesTreeColor(cardData) {
        const speciesColorById = {
            beech: 'green',
            birch: 'lime',
            silver_birch: 'lime',
            oak: 'brown',
            linden: 'yellow',
            douglas_fir: 'silver',
            horse_chestnut: 'orange',
            silver_fir: 'blue',
            sycamore: 'red'
        };
        const speciesId = this.normalizeCardKey(cardData && (cardData.cardId || cardData.name));
        return speciesColorById[speciesId] || '';
    }

    getFallbackColorByCard(cardData) {
        const cardId = this.normalizeCardKey(cardData && (cardData.cardId || cardData.name));
        if (!cardId) return '';

        if (!this.cardFallbackColorsById) {
            const fallback = {};
            const register = (name, colors) => {
                const normalizedName = this.normalizeCardKey(name);
                if (!normalizedName || !Array.isArray(colors) || colors.length === 0) return;
                if (!fallback[normalizedName]) fallback[normalizedName] = String(colors[0]);
            };

            const deck = window.MasterDeck && Array.isArray(window.MasterDeck.deck)
                ? window.MasterDeck.deck
                : [];

            deck.forEach((card) => {
                if (!card || !card.content) return;
                if (card.split_type === 'left_right') {
                    register(card.content.left && card.content.left.name, card.content.left && card.content.left.colors);
                    register(card.content.right && card.content.right.name, card.content.right && card.content.right.colors);
                } else if (card.split_type === 'top_bottom') {
                    register(card.content.top && card.content.top.name, card.content.top && card.content.top.colors);
                    register(card.content.bottom && card.content.bottom.name, card.content.bottom && card.content.bottom.colors);
                }
            });

            this.cardFallbackColorsById = fallback;
        }

        return this.cardFallbackColorsById[cardId] || '';
    }

    getPrimaryDisplayColor(cardData, slotName) {
        const colors = Array.isArray(cardData && cardData.colors)
            ? cardData.colors.filter((color) => String(color || '').trim().length > 0)
            : [];
        if (colors.length > 0) return String(colors[0]);
        if (slotName === 'species') return this.getSpeciesTreeColor(cardData);
        return this.getFallbackColorByCard(cardData);
    }

    getUsedCardFilenames() {
        const used = new Set();
        this.state.trees.forEach((tree) => {
            if (tree.species && tree.species.filename) used.add(tree.species.filename);
            ['top', 'bottom', 'left', 'right'].forEach((slot) => {
                (tree[slot] || []).forEach((card) => {
                    if (card && card.filename) used.add(card.filename);
                });
            });
        });
        return used;
    }

    renderModalList(filter = '') {
        const list = document.getElementById('modal-card-list');
        list.innerHTML = '';
        const usedFilenames = this.getUsedCardFilenames();
        window.MasterDeck.deck.forEach((card) => {
            let validSideData = null, folderMap = '';

            if (this.activeModalMode === 'commonToadExtra') {
                if (card.split_type === 'top_bottom' && !usedFilenames.has(card.filename)) {
                    const bottomName = this.normalizeCardKey(card.content && card.content.bottom && card.content.bottom.name);
                    if (bottomName === 'common_toad') {
                        validSideData = card.content.bottom;
                        folderMap = 'top_bottom';
                    }
                }
            } else if (this.activeModalMode === 'europeanHareExtra') {
                if (card.split_type === 'left_right' && (this.activeSlot === 'left' || this.activeSlot === 'right') && !usedFilenames.has(card.filename)) {
                    const sideName = this.normalizeCardKey(card.content && card.content[this.activeSlot] && card.content[this.activeSlot].name);
                    if (sideName === 'european_hare') {
                        validSideData = card.content[this.activeSlot];
                        folderMap = 'left_right';
                    }
                }
            } else if (this.activeSlot === 'species' && card.split_type === 'trees') { validSideData = card.content.tree; folderMap = 'Tree'; }
            else if (card.split_type === 'left_right' && (this.activeSlot === 'left' || this.activeSlot === 'right')) { validSideData = card.content[this.activeSlot]; folderMap = 'left_right'; }
            else if (card.split_type === 'top_bottom' && (this.activeSlot === 'top' || this.activeSlot === 'bottom')) { validSideData = card.content[this.activeSlot]; folderMap = 'top_bottom'; }
            
            if (validSideData && validSideData.name.toLowerCase().includes(filter.toLowerCase())) {
                const btn = document.createElement('button');
                btn.className = 'modal-card-btn';
                btn.innerHTML = `
                    <img src="Assetes/Cards/${folderMap}/${card.filename}" class="modal-card-img" onerror="this.style.display='none'">
                    <span>${validSideData.name}</span>
                `;
                btn.onclick = () => {
                    if (this.activeModalMode === 'commonToadExtra') {
                        const tree = this.state.trees.find(t => t.id === this.activeTreeId);
                        if (!tree) return;
                        const bottomCommonToadCount = (tree.bottom || []).filter(c => this.isCommonToadCard(c)).length;
                        if (bottomCommonToadCount >= 2) {
                            this.closeModal();
                            return;
                        }
                    }

                    const scoringMeta = (typeof ScoringEngine !== 'undefined' && typeof ScoringEngine.resolveCardMeta === 'function')
                        ? ScoringEngine.resolveCardMeta(this.activeSlot, validSideData.name)
                        : { cardId: null, symbols: [], ruleType: null };

                    this.state.addCardToSlot(this.activeTreeId, this.activeSlot, {
                        filename: card.filename,
                        folder: folderMap,
                        name: validSideData.name,
                        colors: validSideData.colors || [],
                        cardId: scoringMeta.cardId,
                        symbols: scoringMeta.symbols,
                        ruleType: scoringMeta.ruleType
                    });
                    this.closeModal();
                };
                list.appendChild(btn);
            }
        });
    }

    renderScoreBreakdown(trees) {
        let panel = document.getElementById('score-breakdown');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'score-breakdown';
            panel.className = 'score-breakdown';
            const header = document.querySelector('header');
            if (header) header.insertAdjacentElement('afterend', panel);
            else this.container.insertAdjacentElement('beforebegin', panel);
        }

        const items = this.state.lastScoreBreakdown || [];
        const groupedByTree = new Map();
        items.forEach(item => {
            if (!groupedByTree.has(item.treeId)) groupedByTree.set(item.treeId, []);
            groupedByTree.get(item.treeId).push(item);
        });

        const groups = trees.map((tree, index) => {
            const treeItems = groupedByTree.get(tree.id) || [];
            const rows = treeItems.map(item => {
                const status = item.calculated ? 'CALC' : 'MISS';
                const pointsSign = item.points >= 0 ? '+' : '';
                return `<div class="score-row"><span class="score-card">${item.cardName}</span><span class="score-meta">${item.slot} • ${item.ruleType || 'NONE'} • ${item.detail}</span><span class="score-points">${pointsSign}${item.points}</span><span class="score-status ${item.calculated ? 'ok' : 'missing'}">${status}</span></div>`;
            }).join('');
            const treeTotal = this.state.lastTreeScores[tree.id] || 0;

            return `<div class="score-tree-group"><div class="score-tree-title">Tree ${index + 1} Total: ${treeTotal}</div><div class="score-tree-list">${rows || '<div class="score-empty">No cards on this tree.</div>'}</div></div>`;
        }).join('');

        const collapseClass = this.isScoreBreakdownCollapsed ? 'collapsed' : 'expanded';
        const toggleLabel = this.isScoreBreakdownCollapsed ? 'Show' : 'Hide';

        panel.innerHTML = `
            <div class="score-breakdown-header">
                <button class="score-breakdown-toggle" type="button" aria-expanded="${!this.isScoreBreakdownCollapsed}">${toggleLabel} Score Breakdown (${items.length} cards)</button>
            </div>
            <div class="score-breakdown-content ${collapseClass}">
                <div class="score-breakdown-list">${groups || '<div class="score-empty">No cards on board.</div>'}</div>
            </div>
        `;

        const toggleButton = panel.querySelector('.score-breakdown-toggle');
        const content = panel.querySelector('.score-breakdown-content');
        if (toggleButton && content) {
            toggleButton.addEventListener('click', () => {
                this.isScoreBreakdownCollapsed = !this.isScoreBreakdownCollapsed;
                content.classList.toggle('collapsed', this.isScoreBreakdownCollapsed);
                content.classList.toggle('expanded', !this.isScoreBreakdownCollapsed);
                toggleButton.setAttribute('aria-expanded', String(!this.isScoreBreakdownCollapsed));
                toggleButton.textContent = `${this.isScoreBreakdownCollapsed ? 'Show' : 'Hide'} Score Breakdown (${items.length} cards)`;
            });
        }
    }

    renderCavePanel() {
        let panel = document.getElementById('cave-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'cave-panel';
            panel.className = 'cave-panel';
            const header = document.querySelector('header');
            if (header) header.insertAdjacentElement('afterend', panel);
            else this.container.insertAdjacentElement('beforebegin', panel);
        }

        const caveCount = this.state.caveCount || 0;
        const minusDisabled = caveCount <= 0 ? 'disabled' : '';
        panel.innerHTML = `
            <div class="cave-title">Cave</div>
            <div class="cave-meta">Hidden cards: ${caveCount} • VP: ${caveCount}</div>
            <div class="cave-actions">
                <button class="cave-subtract-btn" type="button" title="Remove a card from cave" ${minusDisabled}>-</button>
                <button class="cave-add-btn" type="button" title="Add a card to cave">+</button>
            </div>
        `;

        const subtractBtn = panel.querySelector('.cave-subtract-btn');
        const addBtn = panel.querySelector('.cave-add-btn');
        if (subtractBtn) {
            subtractBtn.addEventListener('click', () => this.state.removeCardFromCave());
        }
        if (addBtn) {
            addBtn.addEventListener('click', () => this.state.addCardToCave());
        }
    }

    renderSlot(tree, slotName) {
        let html = `<div class="slot-cards">`;
        const cards = slotName === 'species' ? (tree.species ? [tree.species] : []) : tree[slotName];

        if (cards.length > 0) {
            const topIndex = cards.length - 1;
            const cardData = cards[topIndex];
            const shouldAnimate = cardData.playedAnimation === false;
            const animationClass = shouldAnimate ? 'planting-animation' : 'card-animated';
            const stackBadge = cards.length > 1 ? `<span class="stack-badge">x${cards.length}</span>` : '';
            const isLindenSpecies = slotName === 'species' && (cardData.cardId === 'linden' || cardData.name === 'Linden');
            const isGreatSpottedWoodpeckerCard = slotName !== 'species' && (cardData.cardId === 'great_spotted_woodpecker' || cardData.name === 'Great Spotted Woodpecker');
            const mostToggle = isLindenSpecies
                ? `<label class="linden-most-label"><input type="checkbox" class="most-toggle" data-tree="${tree.id}" data-flag="hasLindenMost" ${cardData.hasLindenMost ? 'checked' : ''}> Most</label>`
                : (isGreatSpottedWoodpeckerCard
                    ? `<label class="linden-most-label"><input type="checkbox" class="most-toggle" data-tree="${tree.id}" data-slot="${slotName}" data-index="${topIndex}" data-flag="hasMost" ${cardData.hasMost ? 'checked' : ''}> Most</label>`
                    : '');
            const isAttachedCard = slotName === 'top' || slotName === 'bottom' || slotName === 'left' || slotName === 'right';
            const isSpeciesCard = slotName === 'species';
            const attachedCardScore = isAttachedCard
                ? ScoringEngine.evaluateDetailed(cardData, this.state.trees, tree).points
                : null;
            const speciesCardScore = isSpeciesCard
                ? (this.state.lastTreeSpeciesScores[tree.id] || 0)
                : null;
            const isSideSlot = slotName === 'left' || slotName === 'right';
            const sideStackTotalScore = isSideSlot
                ? cards.reduce((sum, card) => sum + ScoringEngine.evaluateDetailed(card, this.state.trees, tree).points, 0)
                : null;
            const scoreBadge = (isAttachedCard || isSpeciesCard)
                ? `<span class="card-score-badge">${isSideSlot ? sideStackTotalScore : (isSpeciesCard ? speciesCardScore : attachedCardScore)}</span>`
                : '';
            const bottomCommonToadCount = slotName === 'bottom'
                ? tree.bottom.filter((card) => this.isCommonToadCard(card)).length
                : 0;
            const showCommonToadAddBtn = slotName === 'bottom' && this.isCommonToadCard(cardData) && bottomCommonToadCount === 1;
            const commonToadAddBtn = showCommonToadAddBtn
                ? `<button class="common-toad-add-btn" data-tree="${tree.id}" title="Add one extra Common Toad">+</button>`
                : '';
            const showEuropeanHareAddBtn = (slotName === 'left' || slotName === 'right') && this.isEuropeanHareCard(cardData);
            const europeanHareCount = this.getEuropeanHareCount();
            const europeanHareAddBtn = showEuropeanHareAddBtn
                ? `<button class="european-hare-add-btn" data-tree="${tree.id}" data-slot="${slotName}" title="Add one extra European Hare">+ [${europeanHareCount}]</button>`
                : '';
            const primaryColor = this.getPrimaryDisplayColor(cardData, slotName);
            const normalizedColor = this.normalizeCardKey(primaryColor);
            const colorBanner = normalizedColor
                ? `<span class="card-color-banner" data-color="${normalizedColor}" title="${primaryColor}"></span>`
                : '';
            const sideStackPreview = isSideSlot ? this.buildSideStackPreviewHtml(cards, slotName) : '';

            html += `
                <div class="mini-card image-card ${animationClass}" data-tree="${tree.id}" data-slot="${slotName}" data-index="${topIndex}">
                    ${sideStackPreview}
                    <img src="Assetes/Cards/${cardData.folder}/${cardData.filename}" class="card-img split-${slotName} ${isSideSlot ? 'side-main-layer' : ''}">
                    ${stackBadge}
                    ${scoreBadge}
                    ${commonToadAddBtn}
                    ${europeanHareAddBtn}
                    ${mostToggle}
                    ${colorBanner}
                    <span class="delete-x">×</span>
                </div>
            `;

            if (shouldAnimate) cardData.playedAnimation = true;
        }

        html += `</div>`;
        if (cards.length === 0) 
            html += `<button class="add-btn small-add" data-tree="${tree.id}" data-slot="${slotName}">+</button>`;
        return html;
    }

    render(trees, totalScore) {
        this.container.innerHTML = '';
        trees.forEach((tree, index) => {
            const treeIsEmpty = !tree.species && tree.top.length === 0 && tree.bottom.length === 0 && tree.left.length === 0 && tree.right.length === 0;
            const treeControlsHtml = treeIsEmpty
                ? `<div class="tree-controls"><button class="danger-btn delete-tree-btn" data-tree="${tree.id}">Delete Tree</button></div>`
                : '';
            const cluster = document.createElement('div'); cluster.className = 'tree-cluster';
            cluster.innerHTML = `<div class="slot slot-top">${this.renderSlot(tree, 'top')}</div><div class="slot slot-left">${this.renderSlot(tree, 'left')}</div><div class="slot slot-center">${this.renderSlot(tree, 'species')}</div><div class="slot slot-right">${this.renderSlot(tree, 'right')}</div><div class="slot slot-bottom">${this.renderSlot(tree, 'bottom')}</div>${treeControlsHtml}`;
            const deleteTreeBtn = cluster.querySelector('.delete-tree-btn');
            if (deleteTreeBtn) {
                deleteTreeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.state.removeTree(tree.id);
                });
            }
            this.container.appendChild(cluster);
        });
        
        // ... (Keep the rest of your render function as is)
        const addBtn = document.createElement('button'); addBtn.id = 'add-tree-btn'; addBtn.className = 'add-btn large-add'; addBtn.innerText = '+ Plant New Tree'; addBtn.addEventListener('click', () => this.state.addTree()); this.container.appendChild(addBtn);
        document.getElementById('total-score-display').innerText = `Total Score: ${totalScore}`;
        this.renderCavePanel();
        this.renderScoreBreakdown(trees);
        this.container.querySelectorAll('.small-add').forEach(btn => btn.addEventListener('click', (e) => this.openModal(e.target.dataset.tree, e.target.dataset.slot)));
        this.container.querySelectorAll('.delete-x').forEach(btn => btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.currentTarget.closest('.image-card');
            if (!card) return;
            const treeId = card.dataset.tree;
            const slot = card.dataset.slot;
            const tree = this.state.trees.find(t => t.id === treeId);
            if (!tree || slot === 'species') {
                this.state.removeCardFromSlot(treeId, slot, Number(card.dataset.index));
                return;
            }
            const liveTopIndex = Math.max(0, ((tree[slot] || []).length - 1));
            this.state.removeCardFromSlot(treeId, slot, liveTopIndex);
        }));
        this.container.querySelectorAll('.common-toad-add-btn').forEach(btn => btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openCommonToadExtraModal(e.currentTarget.dataset.tree);
        }));
        this.container.querySelectorAll('.european-hare-add-btn').forEach(btn => btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEuropeanHareExtraModal(e.currentTarget.dataset.tree, e.currentTarget.dataset.slot);
        }));
        this.container.querySelectorAll('.most-toggle').forEach(input => input.addEventListener('change', (e) => {
            e.stopPropagation();
            const mostFlag = e.currentTarget.dataset.flag || 'hasLindenMost';
            const treeId = e.currentTarget.dataset.tree;
            const slot = e.currentTarget.dataset.slot;
            const index = Number(e.currentTarget.dataset.index);
            if (slot && Number.isInteger(index)) {
                this.state.updateCardMeta(treeId, slot, index, { [mostFlag]: !!e.currentTarget.checked });
                return;
            }
            this.state.updateSpeciesCardMeta(treeId, { [mostFlag]: !!e.currentTarget.checked });
        }));
    }
}

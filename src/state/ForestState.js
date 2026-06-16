import { ScoringEngine } from '../scoring/ScoringEngine.js';

export class ForestState {
    constructor() {
        const savedData = localStorage.getItem('forestShuffleSave');
        const savedCaveCount = Number(localStorage.getItem('forestShuffleCaveCount') || 0);
        this.trees = savedData ? JSON.parse(savedData) : [];
        this.caveCount = Number.isFinite(savedCaveCount) ? savedCaveCount : 0;
        const seenIds = new Set();
        this.trees = this.trees.map(tree => {
            const nextTree = tree || {};
            if (!nextTree.id || seenIds.has(nextTree.id)) {
                nextTree.id = crypto.randomUUID();
            }
            seenIds.add(nextTree.id);
            return nextTree;
        });
        this.listeners = [];
        this.lastScoreBreakdown = [];
        this.lastTreeScores = {};
        this.lastTreeSpeciesScores = {};
    }
    
    subscribe(listener) { this.listeners.push(listener); }
    
    notify() { 
        localStorage.setItem('forestShuffleSave', JSON.stringify(this.trees));
        localStorage.setItem('forestShuffleCaveCount', String(this.caveCount));
        this.listeners.forEach(listener => listener(this.trees, this.calculateTotalScore())); 
    }
    
    resetGame() {
        if(confirm("Are you sure you want to clear the board?")) {
            this.trees = [];
            this.caveCount = 0;
            this.notify();
        }
    }
    
    createTree() {
        const newTree = { 
            id: crypto.randomUUID(), 
            species: null, 
            top: [], 
            bottom: [], 
            left: [], 
            right: [] 
        };
        this.trees.push(newTree);
        this.notify();
        return newTree.id; 
    }
    
    addTree() { this.trees.push({ id: crypto.randomUUID(), species: null, top: [], bottom: [], left: [], right: [] }); this.notify(); }
    
    // NEW CAVE MATH LOGIC
    updateCaveScore(amount) {
        this.caveCount = Math.max(0, (this.caveCount || 0) + amount);
        this.notify();
    }

    removeTree(treeId) {
        this.trees = this.trees.filter(t => t.id !== treeId);
        this.notify();
    }
    
    /**
     * Adds a card to a tree slot.
     * @param {boolean} [allowStack=false]  Pass true for cards that stack
     *   (CommonToad second copy, EuropeanHare extras). Without this flag the
     *   method rejects if the slot is already occupied.
     */
    addCardToSlot(treeId, slot, cardData, allowStack = false) {
        const tree = this.trees.find(t => t.id === treeId);
        if (!tree) return false;

        const card = { ...cardData, playedAnimation: false };

        if (slot === 'species') {
            if (tree.species !== null) return false;
            tree.species = card;
        } else {
            if (!allowStack && tree[slot].length > 0) return false;
            tree[slot].push(card);
        }

        this.notify();
        return true;
    }
    
    removeCardFromSlot(treeId, slot, index) {
        const tree = this.trees.find(t => t.id === treeId);
        if (!tree) return;
        if (slot === 'species') tree.species = null;
        else tree[slot].splice(index, 1);
        this.notify();
    }
    
    updateSpeciesCardMeta(treeId, patch) {
        const tree = this.trees.find(t => t.id === treeId);
        if (!tree || !tree.species) return;
        tree.species = { ...tree.species, ...patch };
        this.notify();
    }

    updateCardMeta(treeId, slot, index, patch) {
        const tree = this.trees.find(t => t.id === treeId);
        if (!tree || !tree[slot] || !tree[slot][index]) return;
        tree[slot][index] = { ...tree[slot][index], ...patch };
        this.notify();
    }

    calculateTreeScore(tree) {
        let total = 0;
        const breakdown = [];

        if (tree.species && tree.species.name) {
            const speciesScore = ScoringEngine.evaluateDetailed(tree.species, this.trees, tree);
            const safePoints = Number(speciesScore.points) || 0; 
            total += safePoints;
            
            breakdown.push({
                treeId: tree.id,
                slot: 'species',
                index: 0,
                card: tree.species,
                cardName: speciesScore.cardName,
                points: safePoints,
                calculated: speciesScore.calculated,
                detail: speciesScore.detail || 'Missing detail',
                ruleType: speciesScore.ruleType,
                contributors: speciesScore.contributors ?? []
            });

            if (speciesScore.points === undefined) {
                console.warn(`⚠️ Warning: The scoring file for ${speciesScore.cardName} is returning an invalid object.`);
            }
        }

        ['top', 'bottom', 'left', 'right'].forEach(slot => {
            tree[slot].forEach((cardData, index) => {
                if (!cardData || !cardData.name) return;
                const cardScore = ScoringEngine.evaluateDetailed(cardData, this.trees, tree);
                const safePoints = Number(cardScore.points) || 0;
                total += safePoints;

                breakdown.push({
                    treeId: tree.id,
                    slot,
                    index,
                    card: cardData,
                    cardName: cardScore.cardName,
                    points: safePoints,
                    calculated: cardScore.calculated,
                    detail: cardScore.detail || 'Missing detail',
                    ruleType: cardScore.ruleType,
                    contributors: cardScore.contributors ?? []
                });

                if (cardScore.points === undefined) {
                    console.warn(`⚠️ Warning: The scoring file for ${cardScore.cardName} is returning an invalid object.`);
                }
            });
        });

        return { total, breakdown };
    }

    calculateTreeSpeciesScore(tree) {
        if (!tree.species || !tree.species.name) return 0;
        const speciesScore = ScoringEngine.evaluateDetailed(tree.species, this.trees, tree);
        return speciesScore.points;
    }

    calculateTotalScore() {
        let total = 0;
        const breakdown = [];
        const treeScores = {};
        const treeSpeciesScores = {};
        this.trees.forEach(tree => {
            const treeScore = this.calculateTreeScore(tree);
            treeScores[tree.id] = treeScore.total;
            treeSpeciesScores[tree.id] = this.calculateTreeSpeciesScore(tree);
            total += treeScore.total;
            breakdown.push(...treeScore.breakdown);
        });
        this.lastTreeScores = treeScores;
        this.lastTreeSpeciesScores = treeSpeciesScores;
        this.lastScoreBreakdown = breakdown;
        return total + this.caveCount;
    }
}
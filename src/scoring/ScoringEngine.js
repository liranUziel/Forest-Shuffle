/**
 * ScoringEngine — evaluates card scores for the entire Forest Shuffle board.
 * Scoring rules for each card live in their own files; this module wires them
 * together and provides shared board-query helpers that card scorers can call.
 */

import { Helpers } from './Helpers.js';

// ── Side-card scorer registry ─────────────────────────────────────────────
import { scoreSqueeker }    from './sides/squeeker.js';
import { scoreBadger }      from './sides/badger.js';
import { scoreEuropeanHare }from './sides/european_hare.js';
import { scoreRedFox }      from './sides/red_fox.js';
import { scoreLynx }        from './sides/lynx.js';
import { scoreRoeDeer }     from './sides/roe_deer.js';
import { scoreRedDeer }     from './sides/red_deer.js';
import { scoreFallowDeer }  from './sides/fallow_deer.js';
import { scoreWolf }        from './sides/wolf.js';
import { scoreWildBoar }    from './sides/wild_boar.js';
import { scoreBeechMarten } from './sides/beech_marten.js';
import { scoreGnat }        from './sides/gnat.js';
import { scoreBat }         from './sides/bat.js';

// ── Top/Bottom-card scorer registry ──────────────────────────────────────
import { scorePondTurtle }           from './top_bottom/pond_turtle.js';
import { scoreTawnyOwl }             from './top_bottom/tawny_owl.js';
import { scoreEurasianJay }          from './top_bottom/eurasian_jay.js';
import { scoreChaffinch }            from './top_bottom/chaffinch.js';
import { scoreRedSquirrel }          from './top_bottom/red_squirrel.js';
import { scoreGreatSpottedWoodpecker}from './top_bottom/great_spotted_woodpecker.js';
import { scoreBullfinch }            from './top_bottom/bullfinch.js';
import { scoreGoshawk }              from './top_bottom/goshawk.js';
import { scoreWoodAnt }              from './top_bottom/wood_ant.js';
import { scoreTreeFrog }             from './top_bottom/tree_frog.js';
import { scoreMoss }                 from './top_bottom/moss.js';
import { scoreWildStrawberries }     from './top_bottom/wild_strawberries.js';
import { scoreTreeFerns }            from './top_bottom/tree_ferns.js';
import { scoreBlackberries }         from './top_bottom/blackberries.js';
import { scoreFlyAgaric }            from './top_bottom/fly_agaric.js';
import { scoreChanterelle }          from './top_bottom/chanterelle.js';
import { scorePennyBun }             from './top_bottom/penny_bun.js';
import { scoreFireSalamander }       from './top_bottom/fire_salamander.js';
import { scoreFirefly }              from './top_bottom/firefly.js';
import { scoreButterfly }            from './top_bottom/butterfly.js';
import { scoreCommonToad }           from './top_bottom/common_toad.js';
import { scoreHedgehog }             from './top_bottom/hedgehog.js';
import { scoreStagBeetle }           from './top_bottom/stag_beetle.js';
import { scoreZeroPoints }           from './top_bottom/zero_points.js';

// ── Tree-card scorer registry ─────────────────────────────────────────────
import { scoreOak }          from './trees/oak.js';
import { scoreLinden }       from './trees/linden.js';
import { scoreDouglasFir }   from './trees/douglas_fir.js';
import { scoreHorseChestnut }from './trees/horse_chestnut.js';
import { scoreSilverFir }    from './trees/silver_fir.js';
import { scoreSycamore }     from './trees/sycamore.js';
import { scoreBirch }        from './trees/birch.js';
import { scoreBeech }        from './trees/beech.js';

// ── Scorer lookup tables (normalised card-id → scorer function) ───────────

const sideCardScorers = {
    squeeker:              scoreSqueeker,
    badger:                scoreBadger,
    european_hare:         scoreEuropeanHare,
    red_fox:               scoreRedFox,
    lynx:                  scoreLynx,
    roe_deer:              scoreRoeDeer,
    red_deer:              scoreRedDeer,
    fallow_deer:           scoreFallowDeer,
    wolf:                  scoreWolf,
    wild_boar:             scoreWildBoar,
    beech_marten:          scoreBeechMarten,
    gnat:                  scoreGnat,
    bechstein_s_bat:       scoreBat,
    beacstein_s_bat:       scoreBat,   // typo alias
    brown_long_eared_bat:  scoreBat,
    greater_horse_shoe_bat:scoreBat,
    greater_horseshoe_bat: scoreBat,   // spelling variant
    barbastelle_bat:       scoreBat,
};

const topBottomCardScorers = {
    pond_turtle:            scorePondTurtle,
    tawny_owl:              scoreTawnyOwl,
    eurasian_jay:           scoreEurasianJay,
    chaffinch:              scoreChaffinch,
    red_squirrel:           scoreRedSquirrel,
    great_spotted_woodpecker: scoreGreatSpottedWoodpecker,
    bullfinch:              scoreBullfinch,
    goshawk:                scoreGoshawk,
    wood_ant:               scoreWoodAnt,
    tree_frog:              scoreTreeFrog,
    moss:                   scoreMoss,
    wild_strawberries:      scoreWildStrawberries,
    tree_ferns:             scoreTreeFerns,
    tree_fern:              scoreTreeFerns,     // spelling variant
    blackberries:           scoreBlackberries,
    fly_agaric:             scoreFlyAgaric,
    chanterelle:            scoreChanterelle,
    penny_bun:              scorePennyBun,
    fire_salamander:        scoreFireSalamander,
    firefly:                scoreFirefly,
    common_toad:            scoreCommonToad,
    hedgehog:               scoreHedgehog,
    stag_beetle:            scoreStagBeetle,
    purple_emperor:         scoreButterfly,
    camberwell_beauty:      scoreButterfly,
    large_tortoiseshell:    scoreButterfly,
    peacock_butterfly:      scoreButterfly,
    silver_washed_fritillary: scoreButterfly,
    parasol_mushroom:       scoreZeroPoints,
    mole:                   scoreZeroPoints,
};

const treeCardScorers = {
    birch:          scoreBirch,
    beech:          scoreBeech,
    oak:            scoreOak,
    linden:         scoreLinden,
    douglas_fir:    scoreDouglasFir,
    horse_chestnut: scoreHorseChestnut,
    silver_fir:     scoreSilverFir,
    sycamore:       scoreSycamore,
};

// ── Engine ────────────────────────────────────────────────────────────────

export { Helpers };

export const ScoringEngine = {

    // ── Rule registry (populated via registerRules) ───────────────────────

    rulesByName: {},
    rulesById: {},
    loadedRules: null,

    /** VP awarded per card type in flat-point scenarios (reference only). */
    treeCasesVp: {
        beech: 5, birch: 1, douglas_fir: 5, sycamore: 1,
        oak: 10, horse_chestnut: 0, linden: 1, silver_fir: 2,
    },
    topBottomCasesVp: {
        pond_turtle: 5, fire_salamander: 0, moss: 10, wild_strawberries: 10,
        tree_ferns: 6, wood_ant: 2, tree_frog: 5, common_toad: 5,
        blackberries: 2, hedgehog: 2, stag_beetle: 1, fly_agaric: 3,
        chanterelle: 5, penny_bun: 4, eurasian_jay: 3, chaffinch: 5,
        red_squirrel: 5,
    },
    sideCasesVp: {},

    /** IDs treated as pawed animals for Stag Beetle scoring. */
    stagBeetlePawedAnimalIds: [
        'brown_bear', 'raccoon', 'european_hare', 'european_badger',
        'european_fat_dormouse', 'wolf', 'beech_marten', 'lynx', 'red_fox',
    ],

    // ── Static card-set helpers ───────────────────────────────────────────

    /** Returns normalised IDs of all pawed animals counted by Stag Beetle. */
    getStagBeetlePawedAnimalIds() {
        return new Set(this.stagBeetlePawedAnimalIds.map(n => Helpers.normalizeName(n)));
    },

    /** Returns the set of normalised butterfly card IDs. */
    getButterflyCardIds() {
        return new Set([
            'purple_emperor', 'camberwell_beauty', 'large_tortoiseshell',
            'peacock_butterfly', 'silver_washed_fritillary',
        ]);
    },

    /** Returns the set of normalised bat card IDs. */
    getBatCardIds() {
        return new Set([
            'bechstein_s_bat', 'beacstein_s_bat', 'brown_long_eared_bat',
            'greater_horse_shoe_bat', 'greater_horseshoe_bat', 'barbastelle_bat',
        ]);
    },

    /** Normalises a bat card ID, resolving spelling variants to the canonical form. */
    getBatTypeId(cardId) {
        const id = Helpers.normalizeName(cardId);
        const aliases = { beacstein_s_bat: 'bechstein_s_bat', greater_horseshoe_bat: 'greater_horse_shoe_bat' };
        return aliases[id] ?? id;
    },

    // ── Private board-query helpers ───────────────────────────────────────

    /**
     * Returns the treeId of the FIRST card matching targetCardId found in any of
     * the given slot arrays.  Used by multiple "leader tree" look-ups.
     */
    _findFirstCardInSlots(boardObject, targetCardId, slots) {
        const entries = slots.flatMap(s => boardObject?.bySlot?.[s] ?? []);
        for (const entry of entries) {
            if (!entry?.card) continue;
            if (Helpers.normalizeName(entry.card.cardId || entry.card.name) === targetCardId)
                return entry.treeId;
        }
        return null;
    },

    // ── Board-query helpers (called by card scorers via `engine` param) ───

    /** Returns the treeId of the first Firefly card in the top/bottom slots. */
    getFireflyTopBottomLeaderTreeId(boardObject) {
        return this._findFirstCardInSlots(boardObject, 'firefly', ['top', 'bottom']);
    },

    /** Returns the treeId of the first Fire Salamander card in the top/bottom slots. */
    getFireSalamanderLeaderTreeId(boardObject) {
        return this._findFirstCardInSlots(boardObject, 'fire_salamander', ['top', 'bottom']);
    },

    /** Returns the treeId of the first Firefly card in the side (left/right) slots. */
    getFireflyLeaderTreeId(boardObject) {
        return this._findFirstCardInSlots(boardObject, 'firefly', ['left', 'right']);
    },

    /** Returns the treeId of the first Butterfly card in the top/bottom slots. */
    getButterflyLeaderTreeId(boardObject) {
        const butterflyIds = this.getButterflyCardIds();
        const entries = [...(boardObject?.bySlot?.top ?? []), ...(boardObject?.bySlot?.bottom ?? [])];
        for (const entry of entries) {
            if (!entry?.card) continue;
            if (butterflyIds.has(Helpers.normalizeName(entry.card.cardId || entry.card.name)))
                return entry.treeId;
        }
        return null;
    },

    /** Returns the treeId of the first Horse Chestnut tree. */
    getHorseChestnutLeaderTreeId(boardObject) {
        for (const [treeId, buckets] of Object.entries(boardObject?.byTree ?? {})) {
            const speciesCard = buckets.species?.[0];
            if (speciesCard && this.getSpeciesIdFromCard(speciesCard) === 'horse_chestnut')
                return treeId;
        }
        return null;
    },

    /** Total count of insects on the board (Bullfinch scoring). */
    getBullfinchInsectCount(boardObject) {
        const insectIds    = new Set(['firefly', 'wood_ant', 'stag_beetle', 'gnat', 'snail', 'violet_carpenter_bee']);
        const butterflyIds = this.getButterflyCardIds();
        let count = 0;
        for (const entry of (boardObject?.all ?? [])) {
            if (!entry?.card) continue;
            const id = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            const hasInsectSymbol = (entry.card.symbols ?? []).some(s => Helpers.normalizeName(s) === 'insect');
            if (hasInsectSymbol || insectIds.has(id) || butterflyIds.has(id)) count++;
        }
        return count;
    },

    /** Count of fully occupied trees (all 5 slots filled). */
    getFullyOccupiedTreeCount(boardObject) {
        return Object.values(boardObject?.byTree ?? {}).reduce((n, b) => {
            const full = b?.species?.[0] && b.top?.length && b.bottom?.length && b.left?.length && b.right?.length;
            return n + (full ? 1 : 0);
        }, 0);
    },

    /** Count of cards that match colorType anywhere on the board. */
    getColorTypeCardCount(boardObject, colorType, bonusTreeSpeciesId) {
        const normalizedColor = Helpers.normalizeName(colorType);
        let count = 0;
        for (const entry of (boardObject?.all ?? [])) {
            if (!entry?.card) continue;
            const colorMatch = (entry.card.colors ?? []).some(c => Helpers.normalizeName(c) === normalizedColor);
            if (colorMatch) { count++; continue; }
            if (entry.slot === 'species' && bonusTreeSpeciesId) {
                if (this.getSpeciesIdFromCard(entry.card) === bonusTreeSpeciesId) count++;
            }
        }
        return count;
    },

    /** Count of bird cards (Goshawk targets) in top/bottom slots. */
    getGoshawkBirdCount(boardObject) {
        const birdIds = new Set(['tawny_owl', 'bullfinch', 'great_spotted_woodpecker', 'eurasian_jay', 'chaffinch', 'goshawk']);
        let count = 0;
        for (const entry of [...(boardObject?.bySlot?.top ?? []), ...(boardObject?.bySlot?.bottom ?? [])]) {
            if (!entry?.card) continue;
            if (birdIds.has(Helpers.normalizeName(entry.card.cardId || entry.card.name))) count++;
        }
        return count;
    },

    /** Count of plant cards (Red Deer targets) anywhere on the board. */
    getRedDeerPlantCount(boardObject) {
        const plantIds = new Set(['blackberries', 'moss', 'mose', 'wild_strawberries', 'tree_fern', 'tree_ferns', 'tree_ferens']);
        let count = 0;
        for (const entry of (boardObject?.all ?? [])) {
            if (!entry?.card) continue;
            if (plantIds.has(Helpers.normalizeName(entry.card.cardId || entry.card.name))) count++;
        }
        return count;
    },

    /** Count of cloven-hoofed animals in side slots. */
    getClovenHoofedAnimalCount(boardObject) {
        const ids = new Set(['red_deer', 'roe_deer', 'wild_boar', 'squeeker', 'fallow_deer']);
        let count = 0;
        for (const entry of [...(boardObject?.bySlot?.left ?? []), ...(boardObject?.bySlot?.right ?? [])]) {
            if (!entry?.card) continue;
            if (ids.has(Helpers.normalizeName(entry.card.cardId || entry.card.name))) count++;
        }
        return count;
    },

    /** Bat scoring stats: total bat cards + distinct bat types in side slots. */
    getBatScoringStats(boardObject) {
        const batIds = this.getBatCardIds();
        const distinctTypes = new Set();
        let totalBatCards = 0;
        for (const entry of [...(boardObject?.bySlot?.left ?? []), ...(boardObject?.bySlot?.right ?? [])]) {
            if (!entry?.card) continue;
            const id = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (!batIds.has(id)) continue;
            totalBatCards++;
            distinctTypes.add(this.getBatTypeId(id));
        }
        return { totalBatCards, distinctBatTypes: distinctTypes.size, active: distinctTypes.size >= 3 };
    },

    /** Total number of bat cards in side slots. */
    getBatCardCount(boardObject) {
        return this.getBatScoringStats(boardObject).totalBatCards;
    },

    // ── Butterfly set mapping ─────────────────────────────────────────────

    /**
     * Groups butterfly cards into sets (one of each species per set).
     * Returns a Map of card → { setIndex, isLeader } and an array of set sizes.
     */
    getButterflySetMapping(boardObject) {
        const cardToSetMap = new Map();
        const sets = [];
        const butterflyIds = this.getButterflyCardIds();
        const entries = [...(boardObject?.bySlot?.top ?? []), ...(boardObject?.bySlot?.bottom ?? [])];

        for (const entry of entries) {
            if (!entry?.card) continue;
            const speciesId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (!butterflyIds.has(speciesId)) continue;

            let placed = false;
            for (let i = 0; i < sets.length; i++) {
                if (!sets[i].speciesSet.has(speciesId)) {
                    sets[i].speciesSet.add(speciesId);
                    cardToSetMap.set(entry.card, { setIndex: i, isLeader: false });
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                const newSet = new Set([speciesId]);
                sets.push({ speciesSet: newSet, leaderCard: entry.card });
                cardToSetMap.set(entry.card, { setIndex: sets.length - 1, isLeader: true });
            }
        }

        return { cardToSetMap, setSizes: sets.map(s => s.speciesSet.size) };
    },

    /** VP for a butterfly set of the given size (max 20). */
    getButterflySetScore(count) {
        return Math.min(Math.max(0, Number(count ?? 0)) * 2, 20);
    },

    // ── Firefly set scoring ───────────────────────────────────────────────

    /** VP for a group of N firefly cards. */
    getFireflySetScore(count) {
        if (count <= 1) return 0;
        if (count === 2) return 10;
        if (count === 3) return 15;
        return 20;
    },

    // ── Horse Chestnut group scoring ──────────────────────────────────────

    /** VP for N horse chestnut trees (n² capped at 49). */
    getHorseChestnutGroupScore(count) {
        if (count <= 0) return 0;
        if (count >= 7) return 49;
        return count * count;
    },

    // ── Violet Carpenter Bee / tree planting ─────────────────────────────

    /** Returns a map of treeId → number of Violet Carpenter Bees on that tree. */
    getVioletCarpenterBeeBonusByTree(boardObject) {
        const bonusByTree = {};
        for (const entry of [...(boardObject?.bySlot?.left ?? []), ...(boardObject?.bySlot?.right ?? [])]) {
            if (!entry?.card) continue;
            if (Helpers.normalizeName(entry.card.cardId || entry.card.name) !== 'violet_carpenter_bee') continue;
            if (!entry.treeId) continue;
            bonusByTree[entry.treeId] = (bonusByTree[entry.treeId] ?? 0) + 1;
        }
        return bonusByTree;
    },

    /** Total planted-tree count, each Violet Carpenter Bee adds +1 to its host tree. */
    getPlantedTreeCount(boardObject) {
        const bonus = this.getVioletCarpenterBeeBonusByTree(boardObject);
        return Object.entries(boardObject?.byTree ?? {}).reduce((acc, [treeId, b]) => {
            if (!(b.species?.length > 0)) return acc;
            return acc + 1 + (bonus[treeId] ?? 0);
        }, 0);
    },

    /** Count of distinct planted tree species. */
    getUniquePlantedTreeTypeCount(boardObject) {
        return this.getUniquePlantedTreeTypeIds(boardObject).length;
    },

    /** Array of distinct planted tree species IDs. */
    getUniquePlantedTreeTypeIds(boardObject) {
        const unique = new Set();
        for (const b of Object.values(boardObject?.byTree ?? {})) {
            const card = b.species?.[0];
            if (card) unique.add(this.getSpeciesIdFromCard(card));
        }
        return Array.from(unique);
    },

    /** Map of speciesId → count planted (Violet Carpenter Bee adds to its host). */
    getTreeSpeciesCounts(boardObject) {
        const counts = {};
        const bonus  = this.getVioletCarpenterBeeBonusByTree(boardObject);
        for (const [treeId, b] of Object.entries(boardObject?.byTree ?? {})) {
            const card = b.species?.[0];
            if (!card) continue;
            const id = this.getSpeciesIdFromCard(card);
            counts[id] = (counts[id] ?? 0) + 1 + (bonus[treeId] ?? 0);
        }
        return counts;
    },

    // ── Board object builder ──────────────────────────────────────────────

    /**
     * Transforms the flat forestState array into an indexed board object with:
     *   byTree — cards grouped by treeId
     *   bySlot — cards grouped by slot (species/top/bottom/left/right)
     *   all    — every card in a flat list
     */
    getAllCardsObject(forestState) {
        const byTree = {};
        const bySlot = { species: [], top: [], bottom: [], left: [], right: [] };
        const all    = [];

        (forestState ?? []).forEach(tree => {
            byTree[tree.id] = { species: tree.species ? [tree.species] : [], top: [...tree.top], bottom: [...tree.bottom], left: [...tree.left], right: [...tree.right], all: [] };

            const push = (card, slot) => {
                if (!card) return;
                const wrapped = { card, slot, treeId: tree.id, tree };
                bySlot[slot].push(wrapped);
                byTree[tree.id].all.push(wrapped);
                all.push(wrapped);
            };

            if (tree.species) push(tree.species, 'species');
            tree.top.forEach(c    => push(c, 'top'));
            tree.bottom.forEach(c => push(c, 'bottom'));
            tree.left.forEach(c   => push(c, 'left'));
            tree.right.forEach(c  => push(c, 'right'));
        });

        return { byTree, bySlot, all };
    },

    // ── Rule registry ─────────────────────────────────────────────────────

    /** Populate rulesByName / rulesById from a card database object. */
    registerRules(cardDb) {
        this.rulesByName = {};
        this.rulesById   = {};
        this.loadedRules = cardDb ?? null;
        if (!cardDb || typeof cardDb !== 'object') return;

        for (const [category, cards] of Object.entries(cardDb)) {
            if (!cards || typeof cards !== 'object') continue;
            for (const [cardId, rule] of Object.entries(cards)) {
                if (!rule?.name) continue;
                const norm = { ...rule, category, cardId: Helpers.normalizeName(cardId) };
                this.rulesByName[Helpers.normalizeName(rule.name)] = norm;
                this.rulesById[norm.cardId] = norm;
            }
        }
    },

    /** Look up card metadata (cardId, symbols, ruleType) by slot + name. */
    resolveCardMeta(slotName, cardName) {
        const expectedCategory = slotName === 'species' ? 'trees'
            : (slotName === 'left' || slotName === 'right' ? 'sides' : slotName);
        const byName = this.rulesByName[Helpers.normalizeName(cardName)];
        if (!byName) return { cardId: Helpers.normalizeName(cardName), symbols: [], ruleType: null };

        return {
            cardId:   byName.cardId,
            symbols:  byName.category === expectedCategory ? undefined : (Array.isArray(byName.symbols) ? byName.symbols : []),
            ruleType: byName.ruleType ?? null,
        };
    },

    /** Look up the full rule object for a card input (string name, or object with cardId/name). */
    resolveRuleForCard(cardInput) {
        if (!cardInput) return null;
        if (typeof cardInput === 'string') return this.rulesByName[Helpers.normalizeName(cardInput)] ?? null;
        return this.rulesById[Helpers.normalizeName(cardInput.cardId)]
            ?? this.rulesByName[Helpers.normalizeName(cardInput.name)]
            ?? null;
    },

    // ── Species ID resolution ─────────────────────────────────────────────

    /** Resolves the canonical tree-species ID from a card object. */
    getSpeciesIdFromCard(card) {
        if (!card) return '';
        const fromId = Helpers.normalizeTreeSpeciesId(card.cardId);
        if (fromId) return fromId;
        const filename = String(card.filename ?? '');
        if (filename) {
            const stem = filename.replace(/\.[^/.]+$/, '');
            const fromFile = Helpers.normalizeTreeSpeciesId(stem);
            if (fromFile) return fromFile;
        }
        return Helpers.normalizeTreeSpeciesId(card.name);
    },

    // ── Card evaluation ───────────────────────────────────────────────────

    /** Evaluate a tree-species card; returns { points, calculated, detail, ruleType }. */
    evaluate_tree_card(cardInput, boardObject, currentTree) {
        const cardId = Helpers.normalizeName(cardInput?.cardId || cardInput?.name);
        if (!cardId) return { points: 0, calculated: false, detail: 'Missing tree card id', ruleType: 'TREE' };
        const scorer = treeCardScorers[cardId];
        return scorer
            ? scorer(cardInput, boardObject, currentTree, Helpers, this)
            : { points: 0, calculated: false, detail: `Tree case not enabled: ${cardId}`, ruleType: 'TREE' };
    },

    /** Evaluate a top/bottom card; returns { points, calculated, detail, ruleType }. */
    evaluate_top_bottom_card(cardInput, boardObject, currentTree) {
        const cardId = Helpers.normalizeName(cardInput?.cardId || cardInput?.name);
        if (!cardId) return { points: 0, calculated: false, detail: 'Missing top/bottom card id', ruleType: 'TOP_BOTTOM_CASE' };
        const scorer = topBottomCardScorers[cardId];
        return scorer
            ? scorer(cardInput, boardObject, currentTree, Helpers, this)
            : { points: 0, calculated: false, detail: `Top/Bottom case not enabled: ${cardId}`, ruleType: 'TOP_BOTTOM_CASE' };
    },

    /** Evaluate a side (left/right) card; returns { points, calculated, detail, ruleType }. */
    evaluate_side_card(cardInput, boardObject, currentTree) {
        const cardId = Helpers.normalizeName(cardInput?.cardId || cardInput?.name);
        if (!cardId) return { points: 0, calculated: false, detail: 'Missing side card id', ruleType: 'SIDE_CASE' };

        const scorer = sideCardScorers[cardId];
        if (scorer) return scorer(cardInput, boardObject, currentTree, Helpers, this);

        if (this.getBatCardIds().has(cardId)) {
            const stats = this.getBatScoringStats(boardObject);
            return {
                points:     stats.active ? 5 : 0,
                calculated: true,
                detail:     stats.active
                    ? `Side case: Bat active (distinct_bats=${stats.distinctBatTypes}) = 5`
                    : `Side case: Bat inactive (distinct_bats=${stats.distinctBatTypes}, need 3)`,
                ruleType: 'SIDE_CASE',
            };
        }

        return { points: 0, calculated: false, detail: `Side case not enabled: ${cardId}`, ruleType: 'SIDE_CASE' };
    },

    /**
     * Main entry point: evaluate one card with full context.
     * Detects which slot the card belongs to, delegates to the right evaluator.
     */
    evaluateDetailed(cardInput, forestState, currentTree) {
        const cardName  = typeof cardInput === 'string' ? cardInput : cardInput?.name;
        if (!cardName)  return { points: 0, calculated: false, cardName: 'Unknown', detail: 'Missing card name', ruleType: null };

        const boardObject = this.getAllCardsObject(forestState);

        if (currentTree && typeof cardInput === 'object') {
            if (currentTree.species === cardInput)
                return { ...this.evaluate_tree_card(cardInput, boardObject, currentTree), cardName };
            if (currentTree.top.includes(cardInput) || currentTree.bottom.includes(cardInput))
                return { ...this.evaluate_top_bottom_card(cardInput, boardObject, currentTree), cardName };
            if (currentTree.left.includes(cardInput) || currentTree.right.includes(cardInput))
                return { ...this.evaluate_side_card(cardInput, boardObject, currentTree), cardName };
        }

        return { points: 0, calculated: false, cardName, detail: 'Card not attached to a valid tree slot yet', ruleType: null };
    },

    /** Evaluate a single card (returns points only) or an entire boardObject. */
    evaluate(cardInputOrBoard, forestState, currentTree) {
        if (cardInputOrBoard?.byTree) {
            return cardInputOrBoard.all.reduce((total, entry) =>
                total + this.evaluateDetailed(entry.card, forestState, entry.tree).points, 0);
        }
        return this.evaluateDetailed(cardInputOrBoard, forestState, currentTree).points;
    },

    // ── Kept for compatibility — delegates to evaluators above ───────────
    evaluate_tree(boardObject)      { return { points: 0, counts: this.getTreeSpeciesCounts(boardObject), detail: 'Modular' }; },
    evaluate_top_bottom(boardObject){ return { points: 0, counts: {}, detail: 'Modular' }; },
    evaluate_left_right(boardObject){ return { points: 0, counts: {}, detail: 'Modular' }; },
    evaluate_sides(boardObject)     { return this.evaluate_left_right(boardObject); },
    evaluateRule_FLAT_POINT(rule)   { const p = Number(rule.points ?? 0); return { points: p, detail: `Flat ${p}` }; },
};

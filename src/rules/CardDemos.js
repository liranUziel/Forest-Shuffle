/**
 * CardDemos.js — builds tiny synthetic boards per card and runs them through
 * the REAL ScoringEngine, so the "how this card scores" popup always shows
 * numbers that match actual gameplay (never hand-typed/duplicated math).
 *
 * Each card gets a recipe describing what to place alongside it for a
 * "low/inactive" board state and a "high/active" one. The popup then labels
 * each computed result with a check or cross based on whether points > 0 —
 * it doesn't need to know in advance which case is "the good one".
 */

import { Helpers } from '../scoring/Helpers.js';
import { ScoringEngine } from '../scoring/ScoringEngine.js';

// top_bottom species whose REAL physical card half is the bottom side — matters
// for scorers that count top/bottom slots separately (e.g. Wood Ant, Common Toad).
const BOTTOM_SIDE_IDS = new Set([
    'pond_turtle', 'wood_ant', 'tree_frog', 'moss', 'wild_strawberries', 'tree_ferns',
    'blackberries', 'fly_agaric', 'hedgehog', 'stag_beetle', 'parasol_mushroom', 'mole',
    'common_toad', 'penny_bun', 'fire_salamander', 'firefly', 'chanterelle',
]);

// Neutral placeholder host species for cards that need *some* tree to sit on.
// Douglas Fir isn't individually counted by any single-species condition
// (unlike birch/oak), so it won't accidentally trigger Fly Agaric/Chanterelle/etc.
const PLACEHOLDER_SPECIES = 'douglas_fir';

function defaultSlotFor(cardId, data) {
    if (data.folder === 'tree') return 'species';
    if (data.folder === 'left_right') return 'left';
    return BOTTOM_SIDE_IDS.has(cardId) ? 'bottom' : 'top';
}

/** Builds { normalizedId: {name, filename, folder, colors, symbols} } from the live deck. */
export function buildCardLookup() {
    const lookup = {};
    const register = (sideData, folder) => {
        if (!sideData?.name) return;
        const id = Helpers.normalizeName(sideData.name);
        if (lookup[id]) return; // keep first occurrence
        lookup[id] = {
            name: sideData.name, folder,
            filename: undefined, // filled in by caller (needs card.filename)
            colors: sideData.colors ?? [], symbols: sideData.symbols ?? [],
        };
    };
    (window.MasterDeck?.deck ?? []).forEach(card => {
        if (card.split_type === 'trees') {
            const id = Helpers.normalizeName(card.content.tree?.name);
            if (id && !lookup[id]) lookup[id] = { name: card.content.tree.name, folder: 'tree', filename: card.filename, colors: [], symbols: [] };
        } else if (card.split_type === 'left_right') {
            ['left', 'right'].forEach(side => {
                const data = card.content[side];
                const id = Helpers.normalizeName(data?.name);
                if (id && !lookup[id]) lookup[id] = { name: data.name, folder: 'left_right', filename: card.filename, colors: data.colors ?? [], symbols: data.symbols ?? [] };
            });
        } else if (card.split_type === 'top_bottom') {
            ['top', 'bottom'].forEach(side => {
                const data = card.content[side];
                const id = Helpers.normalizeName(data?.name);
                if (id && !lookup[id]) lookup[id] = { name: data.name, folder: 'top_bottom', filename: card.filename, colors: data.colors ?? [], symbols: data.symbols ?? [] };
            });
        }
    });
    return lookup;
}

function toCardObj(lookup, cardId) {
    const data = lookup[cardId];
    if (!data) return null;
    return { filename: data.filename, folder: data.folder, name: data.name, colors: data.colors, symbols: data.symbols, cardId: Helpers.normalizeName(data.name) };
}

const makeTree = id => ({ id, species: null, top: [], bottom: [], left: [], right: [] });

/**
 * Builds an array of synthetic trees for one scenario.
 * @param {string} subjectId  normalized id of the card under test
 * @param {object} lookup     id -> card data
 * @param {{subjectSlot?:string, speciesOverride?:string, flags?:object, aux?:{cardId:string,slot?:string,sameTree?:boolean}[]}} config
 */
function buildScenario(subjectId, lookup, config = {}) {
    const subjectData = lookup[subjectId];
    if (!subjectData) return null;
    const subjectSlot = config.subjectSlot ?? defaultSlotFor(subjectId, subjectData);

    const subjectTree = makeTree('subject-tree');
    const subjectCardObj = toCardObj(lookup, subjectId);
    Object.assign(subjectCardObj, config.flags ?? {});

    if (subjectSlot === 'species') {
        subjectTree.species = subjectCardObj;
    } else {
        if (config.speciesOverride) subjectTree.species = toCardObj(lookup, config.speciesOverride);
        else subjectTree.species = toCardObj(lookup, PLACEHOLDER_SPECIES);
        subjectTree[subjectSlot].push(subjectCardObj);
    }

    const trees = [subjectTree];
    (config.aux ?? []).forEach((aux, i) => {
        const auxData = lookup[aux.cardId];
        if (!auxData) return;
        const auxCardObj = toCardObj(lookup, aux.cardId);
        if (aux.sameTree) {
            const slot = aux.slot ?? defaultSlotFor(aux.cardId, auxData);
            if (slot === 'species') subjectTree.species = auxCardObj;
            else subjectTree[slot].push(auxCardObj);
        } else {
            const auxTree = makeTree(`aux-${i}`);
            const slot = aux.slot ?? defaultSlotFor(aux.cardId, auxData);
            if (slot === 'species') auxTree.species = auxCardObj;
            else { auxTree.species = toCardObj(lookup, PLACEHOLDER_SPECIES); auxTree[slot].push(auxCardObj); }
            trees.push(auxTree);
        }
    });

    return { trees, subjectTree, subjectCardObj };
}

/** Runs one scenario through the real engine, returning { points, detail, cards }. */
function evaluateScenario(scenario) {
    if (!scenario) return null;
    const result = ScoringEngine.evaluateDetailed(scenario.subjectCardObj, scenario.trees, scenario.subjectTree);
    return { points: Number(result.points) || 0, detail: result.detail, calculated: result.calculated };
}

// ── Per-card demo recipes ───────────────────────────────────────────────
// `low`/`high` are board configs handed to buildScenario (omit for "card alone").
// `shape` drives which popup template renders: 'flat' | 'conditional' | 'set-count' | 'set-species'.

const RECIPES = {
    // Trees
    silver_fir:    { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'squeeker', slot: 'left', sameTree: true }, { cardId: 'badger', slot: 'right', sameTree: true }] } },
    sycamore:      { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'sycamore' }, { cardId: 'sycamore' }] } },
    horse_chestnut:{ shape: 'set-count', low: {}, high: { aux: Array.from({ length: 6 }, () => ({ cardId: 'horse_chestnut' })) } },
    linden:        { shape: 'conditional', low: { flags: { hasLindenMost: false } }, high: { flags: { hasLindenMost: true } } },
    beech:         { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'beech' }, { cardId: 'beech' }, { cardId: 'beech' }] } },
    oak:           { shape: 'conditional', low: {}, high: { aux: ['beech', 'birch', 'douglas_fir', 'horse_chestnut', 'linden', 'silver_fir', 'sycamore'].map(cardId => ({ cardId })) } },
    douglas_fir:   { shape: 'flat' },
    birch:         { shape: 'flat' },

    // Birds
    bullfinch:     { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'gnat' }, { cardId: 'gnat' }] } },
    chaffinch:     { shape: 'conditional', low: { speciesOverride: 'oak' }, high: { speciesOverride: 'beech' } },
    eurasian_jay:  { shape: 'flat' },
    goshawk:       { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'tawny_owl' }, { cardId: 'bullfinch' }] } },
    great_spotted_woodpecker: { shape: 'conditional', low: { flags: { hasMost: false } }, high: { flags: { hasMost: true } } },
    tawny_owl:     { shape: 'flat' },

    // Butterflies — handled via the dedicated set-species template
    camberwell_beauty:       { shape: 'set-species' },
    large_tortoiseshell:     { shape: 'set-species' },
    peacock_butterfly:       { shape: 'set-species' },
    purple_emperor:          { shape: 'set-species' },
    silver_washed_fritillary:{ shape: 'set-species' },

    // Pawed-animal
    red_squirrel:  { shape: 'conditional', low: { speciesOverride: 'birch' }, high: { speciesOverride: 'oak' } },
    hedgehog:      { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'purple_emperor' }, { cardId: 'camberwell_beauty' }] } },
    mole:          { shape: 'flat' },
    raccoon:       { shape: 'flat' },
    badger:        { shape: 'flat' },
    red_fox:       { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'european_hare' }, { cardId: 'european_hare' }] } },
    european_hare: { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'european_hare' }, { cardId: 'european_hare' }] } },
    beech_marten:  { shape: 'conditional', low: {}, high: { subjectSlot: 'left', aux: [
        { cardId: 'birch', slot: 'species', sameTree: true },
        { cardId: 'pond_turtle', slot: 'top', sameTree: true },
        { cardId: 'tree_frog', slot: 'bottom', sameTree: true },
        { cardId: 'squeeker', slot: 'right', sameTree: true },
    ] } },
    wolf:          { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'red_deer' }, { cardId: 'roe_deer' }] } },
    european_fat_dormouse: { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'barbastelle_bat', slot: 'right', sameTree: true }] } },

    lynx:          { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'roe_deer' }] } },
    brown_bear:    { shape: 'flat' },

    // Insect
    firefly:       { shape: 'set-count', low: {}, high: { aux: [{ cardId: 'firefly' }, { cardId: 'firefly' }, { cardId: 'firefly' }] } },
    stag_beetle:   { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'wolf' }, { cardId: 'lynx' }] } },
    wood_ant:      { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'wood_ant' }, { cardId: 'wood_ant' }] } },
    gnat:          { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'barbastelle_bat' }, { cardId: 'bechstein_s_bat' }] } },

    // Plant
    tree_ferns:    { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'pond_turtle' }, { cardId: 'tree_frog' }] } },
    violet_carpenter_bee: { shape: 'flat' },
    moss:          { shape: 'conditional', low: {}, high: { aux: Array.from({ length: 9 }, () => ({ cardId: 'birch' })) } },
    wild_strawberries: { shape: 'conditional', low: {}, high: { aux: ['beech', 'birch', 'horse_chestnut', 'linden', 'oak', 'silver_fir', 'sycamore'].map(cardId => ({ cardId })) } },
    blackberries:  { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'moss' }, { cardId: 'wild_strawberries' }] } },

    // Amphibians
    pond_turtle:   { shape: 'flat' },
    tree_frog:     { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'gnat' }, { cardId: 'gnat' }] } },
    common_toad:   { shape: 'conditional', low: { subjectSlot: 'bottom' }, high: { subjectSlot: 'bottom', aux: [{ cardId: 'common_toad', slot: 'bottom', sameTree: true }] } },
    fire_salamander: { shape: 'set-count', low: {}, high: { aux: [{ cardId: 'fire_salamander' }, { cardId: 'fire_salamander' }] } },

    // Mushrooms
    chanterelle:   { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'oak' }] } },
    parasol_mushroom: { shape: 'flat' },
    fly_agaric:    { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'birch' }] } },
    penny_bun:     { shape: 'flat' },

    // Cloven-hoofed
    squeeker:      { shape: 'flat' },
    wild_boar:     { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'squeeker' }] } },

    // Deer
    fallow_deer:   { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'red_deer' }, { cardId: 'roe_deer' }] } },
    roe_deer:      { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'wolf' }, { cardId: 'red_fox' }] } },
    red_deer:      { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'moss' }, { cardId: 'blackberries' }] } },

    // Bats
    barbastelle_bat:      { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'bechstein_s_bat' }, { cardId: 'brown_long_eared_bat' }] } },
    bechstein_s_bat:      { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'barbastelle_bat' }, { cardId: 'brown_long_eared_bat' }] } },
    brown_long_eared_bat: { shape: 'conditional', low: {}, high: { aux: [{ cardId: 'barbastelle_bat' }, { cardId: 'bechstein_s_bat' }] } },
    greater_horse_shoe_bat:{ shape: 'conditional', low: {}, high: { aux: [{ cardId: 'barbastelle_bat' }, { cardId: 'bechstein_s_bat' }] } },
};

const BUTTERFLY_SPECIES = ['purple_emperor', 'camberwell_beauty', 'large_tortoiseshell', 'peacock_butterfly', 'silver_washed_fritillary'];

/** Returns { shape, cases: [{label, points, detail, cards:[{name,filename,folder}]}] } for one card. */
export function getCardDemo(cardId, lookup) {
    const recipe = RECIPES[cardId];
    if (!recipe) return null;

    if (recipe.shape === 'flat') {
        const scenario = buildScenario(cardId, lookup, {});
        const result = evaluateScenario(scenario);
        return { shape: 'flat', cases: [{ label: 'Always', points: result?.points ?? 0, detail: result?.detail }] };
    }

    if (recipe.shape === 'set-species') {
        // 3 unique species (incl. subject) form a complete-ish set; a 4th card
        // duplicates the subject's species, forcing a new (empty) set.
        const others = BUTTERFLY_SPECIES.filter(id => id !== cardId).slice(0, 2);
        const config = { aux: [...others.map(id => ({ cardId: id })), { cardId }] };
        const scenario = buildScenario(cardId, lookup, config);
        if (!scenario) return null;

        const boardObj = ScoringEngine.getAllCardsObject(scenario.trees);
        const mapping = ScoringEngine.getButterflySetMapping(boardObj);
        const cards = scenario.trees.map(t => t.top[0]).filter(Boolean);
        const annotated = cards.map(card => {
            const info = mapping.cardToSetMap.get(card);
            const setSize = info ? mapping.setSizes[info.setIndex] : 0;
            const setScale = { 0: 0, 1: 0, 2: 3, 3: 6, 4: 12, 5: 20 };
            return { card, setIndex: info?.setIndex ?? -1, points: info?.isLeader ? (setScale[setSize] || 0) : 0, setSize };
        });
        return { shape: 'set-species', cards: annotated };
    }

    if (recipe.shape === 'set-count') {
        const lowScenario = buildScenario(cardId, lookup, recipe.low);
        const highScenario = buildScenario(cardId, lookup, recipe.high);
        return {
            shape: 'set-count',
            cases: [
                { label: 'Small set', ...evaluateScenario(lowScenario) },
                { label: 'Larger set', ...evaluateScenario(highScenario) },
            ],
        };
    }

    // conditional
    let { low, high } = recipe;
    if (cardId === 'roe_deer') {
        // Roe Deer scores per card sharing its OWN color, so the demo's aux
        // cards must dynamically match whatever color this print actually has.
        const myColor = Helpers.normalizeName(lookup.roe_deer?.colors?.[0] ?? '');
        const matches = Object.keys(lookup)
            .filter(id => id !== 'roe_deer' && (lookup[id].colors ?? []).some(c => Helpers.normalizeName(c) === myColor))
            .slice(0, 2)
            .map(id => ({ cardId: id }));
        high = { aux: matches };
    }

    const lowScenario = buildScenario(cardId, lookup, low ?? {});
    const highScenario = buildScenario(cardId, lookup, high ?? {});
    const lowResult = evaluateScenario(lowScenario);
    const highResult = evaluateScenario(highScenario);
    return {
        shape: 'conditional',
        cases: [
            { label: 'Case A', ...lowResult, auxCards: (low?.aux ?? []).map(a => lookup[a.cardId]).filter(Boolean) },
            { label: 'Case B', ...highResult, auxCards: (high?.aux ?? []).map(a => lookup[a.cardId]).filter(Boolean) },
        ],
    };
}

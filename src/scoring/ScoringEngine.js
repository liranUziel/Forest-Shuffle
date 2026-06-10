// points.js - incremental scoring engine

// Sides
import { scoreSqueeker } from './sides/squeeker.js';
import { scoreBadger } from './sides/badger.js';
import { scoreEuropeanHare } from './sides/european_hare.js';
import { scoreRedFox } from './sides/red_fox.js';
import { scoreLynx } from './sides/lynx.js';
import { scoreRoeDeer } from './sides/roe_deer.js';
import { scoreRedDeer } from './sides/red_deer.js';
import { scoreFallowDeer } from './sides/fallow_deer.js';
import { scoreWolf } from './sides/wolf.js';
import { scoreWildBoar } from './sides/wild_boar.js';
import { scoreBeechMarten } from './sides/beech_marten.js';
import { scoreGnat } from './sides/gnat.js';
import { scoreBat } from './sides/bat.js';

// Top/Bottom
import { scorePondTurtle } from './top_bottom/pond_turtle.js';
import { scoreTawnyOwl } from './top_bottom/tawny_owl.js';
import { scoreEurasianJay } from './top_bottom/eurasian_jay.js';
import { scoreChaffinch } from './top_bottom/chaffinch.js';
import { scoreRedSquirrel } from './top_bottom/red_squirrel.js';
import { scoreGreatSpottedWoodpecker } from './top_bottom/great_spotted_woodpecker.js';
import { scoreBullfinch } from './top_bottom/bullfinch.js';
import { scoreGoshawk } from './top_bottom/goshawk.js';
import { scoreWoodAnt } from './top_bottom/wood_ant.js';
import { scoreTreeFrog } from './top_bottom/tree_frog.js';
import { scoreMoss } from './top_bottom/moss.js';
import { scoreWildStrawberries } from './top_bottom/wild_strawberries.js';
import { scoreTreeFerns } from './top_bottom/tree_ferns.js';
import { scoreBlackberries } from './top_bottom/blackberries.js';
import { scoreFlyAgaric } from './top_bottom/fly_agaric.js';
import { scoreChanterelle } from './top_bottom/chanterelle.js';
import { scorePennyBun } from './top_bottom/penny_bun.js';
import { scoreFireSalamander } from './top_bottom/fire_salamander.js';
import { scoreFirefly } from './top_bottom/firefly.js';
import { scoreButterfly } from './top_bottom/butterfly.js';
import { scoreCommonToad } from './top_bottom/common_toad.js';
import { scoreHedgehog } from './top_bottom/hedgehog.js';
import { scoreStagBeetle } from './top_bottom/stag_beetle.js';
import { scoreZeroPoints } from './top_bottom/zero_points.js';

// Trees
import { scoreOak } from './trees/oak.js';
import { scoreLinden } from './trees/linden.js';
import { scoreDouglasFir } from './trees/douglas_fir.js';
import { scoreHorseChestnut } from './trees/horse_chestnut.js';
import { scoreSilverFir } from './trees/silver_fir.js';
import { scoreSycamore } from './trees/sycamore.js';
import { scoringBirch } from './trees/birch.js';
import { scoringBeech } from './trees/beech.js';


export const Helpers = {
    normalizeName(value) {
        const normalized = String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');

        const aliases = {
            fireflies: 'firefly',
            blacberries: 'blackberries',
            wild_stawberries: 'wild_strawberries',
            coomon_toad: 'common_toad',
            commond_toad: 'common_toad',
            squeaker: 'squeeker',
            european_badger: 'badger',
            silver_washed_fritllary: 'silver_washed_fritillary',
            sliver_washed_fritllary: 'silver_washed_fritillary',
            large_trotiseshell: 'large_tortoiseshell',
            large_trotoiseshell: 'large_tortoiseshell',
            large_tortoieseshell: 'large_tortoiseshell'
        };

        return aliases[normalized] || normalized;
    },

    normalizeTreeSpeciesId(value) {
        const normalized = Helpers.normalizeName(value);
        const aliases = {
            silver_birch: 'birch'
        };
        return aliases[normalized] || normalized;
    }
};

const sideCardScorers = {
    'squeeker': scoreSqueeker,
    'badger': scoreBadger,
    'european_hare': scoreEuropeanHare,
    'red_fox': scoreRedFox,
    'lynx': scoreLynx,
    'roe_deer': scoreRoeDeer,
    'red_deer': scoreRedDeer,
    'fallow_deer': scoreFallowDeer,
    'wolf': scoreWolf,
    'wild_boar': scoreWildBoar,
    'beech_marten': scoreBeechMarten,
    'gnat': scoreGnat,
    'bechstein_s_bat': scoreBat,
    'beacstein_s_bat': scoreBat, 
    'brown_long_eared_bat': scoreBat,
    'greater_horse_shoe_bat': scoreBat,
    'greater_horseshoe_bat': scoreBat,
    'barbastelle_bat': scoreBat,
};

const topBottomCardScorers = {
    'pond_turtle': scorePondTurtle,
    'tawny_owl': scoreTawnyOwl,
    'eurasian_jay': scoreEurasianJay,
    'chaffinch': scoreChaffinch,
    'red_squirrel': scoreRedSquirrel,
    'great_spotted_woodpecker': scoreGreatSpottedWoodpecker,
    'bullfinch': scoreBullfinch,
    'goshawk': scoreGoshawk,
    'wood_ant': scoreWoodAnt,
    'tree_frog': scoreTreeFrog,
    'moss': scoreMoss,
    'wild_strawberries': scoreWildStrawberries,
    'tree_ferns': scoreTreeFerns,
    'tree_fern': scoreTreeFerns, // Alias mapping
    'blackberries': scoreBlackberries,
    'fly_agaric': scoreFlyAgaric,
    'chanterelle': scoreChanterelle,
    'penny_bun': scorePennyBun,
    'fire_salamander': scoreFireSalamander,
    'firefly': scoreFirefly,
    'common_toad': scoreCommonToad,
    'hedgehog': scoreHedgehog,
    'stag_beetle': scoreStagBeetle,
    // Map all butterflies
    'purple_emperor': scoreButterfly,
    'camberwell_beauty': scoreButterfly,
    'large_tortoiseshell': scoreButterfly,
    'peacock_butterfly': scoreButterfly,
    'silver_washed_fritillary': scoreButterfly,
    // 0-point cards
    'parasol_mushroom': scoreZeroPoints,
    'mole': scoreZeroPoints
};

const treeCardScorers = {
    'birch': scoreBirch,
    'silver_birch': scoreSilverBirch,
    'beech': scoreBeech,
    'oak': scoreOak,
    'linden': scoreLinden,
    'douglas_fir': scoreDouglasFir,
    'horse_chestnut': scoreHorseChestnut,
    'silver_fir': scoreSilverFir,
    'sycamore': scoreSycamore
};

export const ScoringEngine = {
    rulesByName: {},
    rulesById: {},
    loadedRules: null,
    treeCasesVp: {
        beech: 5,
        birch: 1,
        douglas_fir: 5,
        sycamore: 1,
        oak: 10,
        horse_chestnut: 0,
        linden: 1,
        silver_fir: 2
    },
    topBottomCasesVp: {
        pond_turtle: 5,
        fire_salamander: 0,
        moss: 10,
        wild_strawberries: 10,
        tree_ferns: 6,
        wood_ant: 2,
        tree_frog: 5,
        common_toad: 5,
        blackberries: 2,
        hedgehog: 2,
        stag_beetle: 1,
        fly_agaric: 3,
        chanterelle: 5,
        penny_bun: 4,
        eurasian_jay: 3,
        chaffinch: 5,
        red_squirrel: 5
    },
    butterflyCardIds: [
        'purple_emperor',
        'camberwell_beauty',
        'large_tortoiseshell',
        'peacock_butterfly',
        'silver_washed_fritillary'
    ],
    sideCasesVp: {},
    stagBeetlePawedAnimalIds: [
        'brown_bear',
        'raccoon',
        'european_hare',
        'european_badger',
        'european_fat_dormouse',
        'wolf',
        'beech_marten',
        'lynx',
        'red_fox'
    ],

    getStagBeetlePawedAnimalIds() {
        return new Set((this.stagBeetlePawedAnimalIds || []).map((name) => Helpers.normalizeName(name)));
    },

    getButterflyCardIds() {
        return new Set((this.butterflyCardIds || []).map((name) => Helpers.normalizeName(name)));
    },

    getButterflySetScore(count) {
        const safeCount = Math.max(0, Number(count || 0));
        return Math.min(safeCount * 2, 20);
    },

    getBullfinchInsectCount(boardObject) {
        const insectIds = new Set(['firefly', 'wood_ant', 'stag_beetle', 'gnat', 'snail', 'violet_carpenter_bee']);
        const allEntries = ((boardObject && boardObject.all) || []);

        let insectCount = 0;
        allEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            const hasInsectSymbol = (entry.card.symbols || []).some((symbol) => Helpers.normalizeName(symbol) === 'insect');
            if (hasInsectSymbol || insectIds.has(entryId)) insectCount += 1;
        });

        return insectCount;
    },

    getFullyOccupiedTreeCount(boardObject) {
        return Object.values((boardObject && boardObject.byTree) || {}).reduce((count, treeBuckets) => {
            const hasSpecies = !!(treeBuckets && treeBuckets.species && treeBuckets.species[0]);
            const hasTop = !!(treeBuckets && treeBuckets.top && treeBuckets.top.length > 0);
            const hasBottom = !!(treeBuckets && treeBuckets.bottom && treeBuckets.bottom.length > 0);
            const hasLeft = !!(treeBuckets && treeBuckets.left && treeBuckets.left.length > 0);
            const hasRight = !!(treeBuckets && treeBuckets.right && treeBuckets.right.length > 0);
            return count + (hasSpecies && hasTop && hasBottom && hasLeft && hasRight ? 1 : 0);
        }, 0);
    },

    getColorTypeCardCount(boardObject, colorType, bonusTreeSpeciesId) {
        const normalizedColor = Helpers.normalizeName(colorType);
        let count = 0;

        ((boardObject && boardObject.all) || []).forEach((entry) => {
            if (!entry || !entry.card) return;
            const card = entry.card;
            const colorMatch = (card.colors || []).some((color) => Helpers.normalizeName(color) === normalizedColor);
            if (colorMatch) {
                count += 1;
                return;
            }

            if (entry.slot === 'species' && bonusTreeSpeciesId) {
                const speciesId = this.getSpeciesIdFromCard(card);
                if (speciesId === bonusTreeSpeciesId) count += 1;
            }
        });

        return count;
    },

    getGoshawkBirdCount(boardObject) {
        const birdIds = new Set([
            'tawny_owl',
            'bullfinch',
            'great_spotted_woodpecker',
            'eurasian_jay',
            'chaffinch',
            'goshawk'
        ]);
        const topBottomEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
        ];

        let birdCount = 0;
        topBottomEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (birdIds.has(entryId)) birdCount += 1;
        });

        return birdCount;
    },

    getRedDeerPlantCount(boardObject) {
        const plantIds = new Set(['blackberries', 'moss', 'mose', 'wild_strawberries', 'tree_fern', 'tree_ferns', 'tree_ferens']);
        let plantCount = 0;

        ((boardObject && boardObject.all) || []).forEach((entry) => {
            if (!entry || !entry.card) return;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (plantIds.has(cardId)) plantCount += 1;
        });

        return plantCount;
    },

    getClovenHoofedAnimalCount(boardObject) {
        const clovenHoofedIds = new Set(['red_deer', 'roe_deer', 'wild_boar', 'squeeker', 'fallow_deer']);
        let count = 0;

        const sideEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        ];

        sideEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (clovenHoofedIds.has(cardId)) count += 1;
        });

        return count;
    },

    getBatCardIds() {
        return new Set([
            'bechstein_s_bat',
            'beacstein_s_bat',
            'brown_long_eared_bat',
            'greater_horse_shoe_bat',
            'greater_horseshoe_bat',
            'barbastelle_bat'
        ]);
    },

    getBatTypeId(cardId) {
        const id = Helpers.normalizeName(cardId);
        const aliases = {
            beacstein_s_bat: 'bechstein_s_bat',
            greater_horseshoe_bat: 'greater_horse_shoe_bat'
        };
        return aliases[id] || id;
    },

    getBatScoringStats(boardObject) {
        const batIds = this.getBatCardIds();
        const distinctTypes = new Set();
        let totalBatCards = 0;

        const sideEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        ];

        sideEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (!batIds.has(entryId)) return;
            totalBatCards += 1;
            distinctTypes.add(this.getBatTypeId(entryId));
        });

        return {
            totalBatCards,
            distinctBatTypes: distinctTypes.size,
            active: distinctTypes.size >= 3
        };
    },

    getBatCardCount(boardObject) {
        const batIds = this.getBatCardIds();
        let totalBatCards = 0;
        const sideEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        ];
        sideEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (batIds.has(entryId)) totalBatCards += 1;
        });
        return totalBatCards;
    },

    getButterflyLeaderTreeId(boardObject) {
        const topBottomEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
        ];

        const butterflyIds = this.getButterflyCardIds();
        for (const entry of topBottomEntries) {
            if (!entry || !entry.card) continue;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (butterflyIds.has(cardId)) return entry.treeId;
        }

        return null;
    },

    registerRules(cardDb) {
        this.rulesByName = {};
        this.rulesById = {};
        this.loadedRules = cardDb || null;
        if (!cardDb || typeof cardDb !== 'object') return;

        Object.entries(cardDb).forEach(([category, cards]) => {
            if (!cards || typeof cards !== 'object') return;
            Object.entries(cards).forEach(([cardId, rule]) => {
                if (!rule || !rule.name) return;
                const normalizedName = Helpers.normalizeName(rule.name);
                const normalizedId = Helpers.normalizeName(cardId);
                const normalizedRule = {
                    ...rule,
                    category,
                    cardId: normalizedId
                };
                this.rulesByName[normalizedName] = normalizedRule;
                this.rulesById[normalizedId] = normalizedRule;
            });
        });
    },

    // Requested helper: return all placed cards as one structured object.
    // Future rule implementations can iterate this object consistently.
    getAllCardsObject(forestState) {
        const byTree = {};
        const bySlot = { species: [], top: [], bottom: [], left: [], right: [] };
        const all = [];

        (forestState || []).forEach((tree) => {
            byTree[tree.id] = {
                species: tree.species ? [tree.species] : [],
                top: [...tree.top],
                bottom: [...tree.bottom],
                left: [...tree.left],
                right: [...tree.right],
                all: []
            };

            const pushCard = (card, slot) => {
                if (!card) return;
                const wrapped = {
                    card,
                    slot,
                    treeId: tree.id,
                    tree
                };
                bySlot[slot].push(wrapped);
                byTree[tree.id].all.push(wrapped);
                all.push(wrapped);
            };

            if (tree.species) pushCard(tree.species, 'species');
            tree.top.forEach((card) => pushCard(card, 'top'));
            tree.bottom.forEach((card) => pushCard(card, 'bottom'));
            tree.left.forEach((card) => pushCard(card, 'left'));
            tree.right.forEach((card) => pushCard(card, 'right'));
        });

        return { byTree, bySlot, all };
    },

    resolveCardMeta(slotName, cardName) {
        const expectedCategory = slotName === 'species'
            ? 'trees'
            : (slotName === 'left' || slotName === 'right' ? 'sides' : slotName);
        const byName = this.rulesByName[Helpers.normalizeName(cardName)];

        if (byName && byName.category === expectedCategory) {
            return {
                cardId: byName.cardId,
                ruleType: byName.ruleType || null
            };
        }

        if (byName) {
            return {
                cardId: byName.cardId,
                symbols: Array.isArray(byName.symbols) ? byName.symbols : [],
                ruleType: byName.ruleType || null
            };
        }

        return {
            cardId: Helpers.normalizeName(cardName),
            symbols: [],
            ruleType: null
        };
    },

    resolveRuleForCard(cardInput) {
        if (!cardInput) return null;
        if (typeof cardInput === 'string') {
            return this.rulesByName[Helpers.normalizeName(cardInput)] || null;
        }

        const byId = this.rulesById[Helpers.normalizeName(cardInput.cardId)];
        if (byId) return byId;

        const byName = this.rulesByName[Helpers.normalizeName(cardInput.name)];
        if (byName) return byName;

        return null;
    },

    evaluateRule_FLAT_POINT(rule) {
        return {
            points: Number(rule.points || 0),
            detail: `Flat ${Number(rule.points || 0)}`
        };
    },

    getSpeciesIdFromCard(card) {
        if (!card) return '';

        const fromCardId = Helpers.normalizeTreeSpeciesId(card.cardId);
        if (fromCardId) return fromCardId;

        const filename = String(card.filename || '');
        if (filename) {
            const withoutExt = filename.replace(/\.[^/.]+$/, '');
            const fromFilename = Helpers.normalizeTreeSpeciesId(withoutExt);
            if (fromFilename) return fromFilename;
        }

        return Helpers.normalizeTreeSpeciesId(card.name);
    },

    getVioletCarpenterBeeBonusByTree(boardObject) {
        const bonusByTree = {};
        const sideEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        ];

        sideEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (cardId !== 'violet_carpenter_bee') return;
            const treeId = entry.treeId;
            if (!treeId) return;
            bonusByTree[treeId] = (bonusByTree[treeId] || 0) + 1;
        });

        return bonusByTree;
    },

    getPlantedTreeCount(boardObject) {
        const bonusByTree = this.getVioletCarpenterBeeBonusByTree(boardObject);
        return Object.entries((boardObject && boardObject.byTree) || {}).reduce((acc, [treeId, treeBuckets]) => {
            if (!(treeBuckets.species && treeBuckets.species.length > 0)) return acc;
            return acc + 1 + (bonusByTree[treeId] || 0);
        }, 0);
    },

    getUniquePlantedTreeTypeCount(boardObject) {
        const uniqueSpecies = new Set();
        Object.values((boardObject && boardObject.byTree) || {}).forEach((treeBuckets) => {
            const speciesCard = treeBuckets.species && treeBuckets.species[0];
            if (!speciesCard) return;
            uniqueSpecies.add(this.getSpeciesIdFromCard(speciesCard));
        });
        return uniqueSpecies.size;
    },

    getUniquePlantedTreeTypeIds(boardObject) {
        const uniqueSpecies = new Set();
        Object.values((boardObject && boardObject.byTree) || {}).forEach((treeBuckets) => {
            const speciesCard = treeBuckets.species && treeBuckets.species[0];
            if (!speciesCard) return;
            uniqueSpecies.add(this.getSpeciesIdFromCard(speciesCard));
        });
        return Array.from(uniqueSpecies);
    },

    getTreeSpeciesCounts(boardObject) {
        const counts = {};
        const bonusByTree = this.getVioletCarpenterBeeBonusByTree(boardObject);
        Object.entries((boardObject && boardObject.byTree) || {}).forEach(([treeId, treeBuckets]) => {
            const speciesCard = treeBuckets.species && treeBuckets.species[0];
            if (!speciesCard) return;
            const speciesId = this.getSpeciesIdFromCard(speciesCard);
            counts[speciesId] = (counts[speciesId] || 0) + 1;
            const bonus = bonusByTree[treeId] || 0;
            if (bonus > 0) {
                counts[speciesId] += bonus;
            }
        });
        return counts;
    },

    getHorseChestnutGroupScore(count) {
        if (count <= 0) return 0;
        if (count >= 7) return 49;
        return count * count;
    },

    getHorseChestnutLeaderTreeId(boardObject) {
        for (const [treeId, treeBuckets] of Object.entries((boardObject && boardObject.byTree) || {})) {
            const speciesCard = treeBuckets.species && treeBuckets.species[0];
            if (!speciesCard) continue;
            const speciesId = this.getSpeciesIdFromCard(speciesCard);
            if (speciesId === 'horse_chestnut') return treeId;
        }
        return null;
    },

    evaluate_tree(boardObject) {
        return { points: 0, counts: this.getTreeSpeciesCounts(boardObject), detail: 'Modular' };
    },
    evaluate_tree_card(cardInput, boardObject, currentTree) {
        const cardId = Helpers.normalizeName(cardInput && (cardInput.cardId || cardInput.name));
        if (!cardId) {
            return { points: 0, calculated: false, detail: 'Missing tree card id', ruleType: 'TREE' };
        }

        const scoringFunction = treeCardScorers[cardId];
        if (scoringFunction) {
            let score = scoringFunction(cardInput, boardObject, currentTree, Helpers, this);
            console.log(`Scoring tree card ${cardId}:`, score);
            return score;
        }

        return {
            points: 0,
            calculated: false,
            detail: `Tree case not enabled: ${cardId}`,
            ruleType: 'TREE'
        };
    },

    evaluate_top_bottom(boardObject) {
        const counts = { fire_salamander: 0, firefly: 0, butterfly: 0 };
        const topBottomEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
        ];
        topBottomEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (cardId === 'fire_salamander') counts.fire_salamander += 1;
            if (cardId === 'firefly') counts.firefly += 1;
            if (this.getButterflyCardIds().has(cardId)) counts.butterfly += 1;
        });
        return { points: 0, counts, detail: 'Modular' };
    },

    getFireflyTopBottomLeaderTreeId(boardObject) {
        const topBottomEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
        ];

        for (const entry of topBottomEntries) {
            if (!entry || !entry.card) continue;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (cardId === 'firefly') return entry.treeId;
        }

        return null;
    },

    getFireSalamanderLeaderTreeId(boardObject) {
        const topBottomEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
        ];

        for (const entry of topBottomEntries) {
            if (!entry || !entry.card) continue;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (cardId === 'fire_salamander') return entry.treeId;
        }

        return null;
    },

    getFireflySetScore(count) {
        if (count <= 1) return 0;
        if (count === 2) return 10;
        if (count === 3) return 15;
        return 20;
    },

    evaluate_left_right(boardObject) {
        return { points: 0, counts: {}, detail: 'Modular' };
    },

    evaluate_sides(boardObject) {
        return this.evaluate_left_right(boardObject);
    },

    getFireflyLeaderTreeId(boardObject) {
        const sideEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        ];

        for (const entry of sideEntries) {
            if (!entry || !entry.card) continue;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (cardId === 'firefly') return entry.treeId;
        }

        return null;
    },

    evaluate_side_card(cardInput, boardObject, currentTree) {
        const cardId = Helpers.normalizeName(cardInput && (cardInput.cardId || cardInput.name));
        if (!cardId) {
            return { points: 0, calculated: false, detail: 'Missing side card id', ruleType: 'SIDE_CASE' };
        }
        const scoringFunction = sideCardScorers[cardId];
        if (scoringFunction) {
            let score = scoringFunction(cardInput, boardObject, currentTree, Helpers, this);
            console.log(`Scoring side card ${cardId}:`, score);
            return score;
        }

        if (this.getBatCardIds().has(cardId)) {
            const batStats = this.getBatScoringStats(boardObject);
            const points = batStats.active ? 5 : 0;
            return {
                points,
                calculated: true,
                detail: batStats.active
                    ? `Side case: Bat active (distinct_bats=${batStats.distinctBatTypes}) = 5`
                    : `Side case: Bat inactive (distinct_bats=${batStats.distinctBatTypes}, need 3)`,
                ruleType: 'SIDE_CASE'
            };
        }

        return {
            points: 0,
            calculated: false,
            detail: `Side case not enabled: ${cardId}`,
            ruleType: 'SIDE_CASE'
        };
    },
    
    evaluate_top_bottom_card(cardInput, boardObject, currentTree) {
        const cardId = Helpers.normalizeName(cardInput && (cardInput.cardId || cardInput.name));
        if (!cardId) {
            return { points: 0, calculated: false, detail: 'Missing top/bottom card id', ruleType: 'TOP_BOTTOM_CASE' };
        }

        const scoringFunction = topBottomCardScorers[cardId];
        if (scoringFunction) {
            return scoringFunction(cardInput, boardObject, currentTree, Helpers, this);
        }

        return {
            points: 0,
            calculated: false,
            detail: `Top/Bottom case not enabled: ${cardId}`,
            ruleType: 'TOP_BOTTOM_CASE'
        };
    },

    evaluateDetailed(cardInput, forestState, currentTree) {
        const cardName = typeof cardInput === 'string' ? cardInput : (cardInput && cardInput.name);
        const boardObject = this.getAllCardsObject(forestState);

        if (!cardName) {
            return { points: 0, calculated: false, cardName: 'Unknown', detail: 'Missing card name', ruleType: null };
        }

        if (currentTree && typeof cardInput === 'object') {
            if (currentTree.species === cardInput) {
                return { ...this.evaluate_tree_card(cardInput, boardObject, currentTree), cardName };
            }
            if (currentTree.top.includes(cardInput) || currentTree.bottom.includes(cardInput)) {
                return { ...this.evaluate_top_bottom_card(cardInput, boardObject, currentTree), cardName };
            }
            if (currentTree.left.includes(cardInput) || currentTree.right.includes(cardInput)) {
                return { ...this.evaluate_side_card(cardInput, boardObject, currentTree), cardName };
            }
        }
        return { points: 0, calculated: false, cardName, detail: 'Card not attached to a valid tree slot yet', ruleType: null };
    },

   evaluate(cardInputOrBoard, forestState, currentTree) {
        if (cardInputOrBoard && typeof cardInputOrBoard === 'object' && cardInputOrBoard.byTree) {
            let totalBoardPoints = 0;
            const boardObject = cardInputOrBoard;
            
            boardObject.all.forEach(entry => {
                const score = this.evaluateDetailed(entry.card, forestState, entry.tree).points;
                totalBoardPoints += score;
            });
            
            return totalBoardPoints;
        }
        
        return this.evaluateDetailed(cardInputOrBoard, forestState, currentTree).points;
    }
};
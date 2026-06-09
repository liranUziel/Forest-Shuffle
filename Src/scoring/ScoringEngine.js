// points.js - incremental scoring engine

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
        const rawCounts = this.getTreeSpeciesCounts(boardObject);
        const counts = {
            beech: rawCounts.beech || 0,
            birch: rawCounts.birch || 0,
            douglas_fir: rawCounts.douglas_fir || 0,
            sycamore: rawCounts.sycamore || 0,
            oak: rawCounts.oak || 0,
            horse_chestnut: rawCounts.horse_chestnut || 0,
            linden: rawCounts.linden || 0,
            silver_fir: rawCounts.silver_fir || 0
        };
        const plantedTrees = this.getPlantedTreeCount(boardObject);
        const uniqueTreeTypes = this.getUniquePlantedTreeTypeCount(boardObject);
        const horseChestnutGroupScore = this.getHorseChestnutGroupScore(counts.horse_chestnut);
        const beechTotal = counts.beech >= 4 ? (counts.beech * this.treeCasesVp.beech) : 0;

        let lindenTotal = 0;
        let greatSpottedWoodpeckerTotal = 0;
        let silverFirTotal = 0;
        Object.values((boardObject && boardObject.byTree) || {}).forEach((treeBuckets) => {
            const speciesCard = treeBuckets.species && treeBuckets.species[0];
            if (!speciesCard) return;
            const speciesId = this.getSpeciesIdFromCard(speciesCard);
            if (speciesId === 'linden') lindenTotal += speciesCard.hasLindenMost ? 3 : 1;
            if (speciesId === 'great_spotted_woodpecker') greatSpottedWoodpeckerTotal += speciesCard.hasMost ? 10 : 0;
            if (speciesId === 'silver_fir') {
                const attachedCount =
                    (treeBuckets.top ? treeBuckets.top.length : 0) +
                    (treeBuckets.bottom ? treeBuckets.bottom.length : 0) +
                    (treeBuckets.left ? treeBuckets.left.length : 0) +
                    (treeBuckets.right ? treeBuckets.right.length : 0);
                silverFirTotal += attachedCount * this.treeCasesVp.silver_fir;
            }
        });

        const total =
            beechTotal +
            (counts.birch * this.treeCasesVp.birch) +
            (counts.douglas_fir * this.treeCasesVp.douglas_fir) +
            (counts.sycamore * this.treeCasesVp.sycamore * plantedTrees) +
            (counts.oak * (uniqueTreeTypes >= 8 ? this.treeCasesVp.oak : 0)) +
            lindenTotal +
            greatSpottedWoodpeckerTotal +
            silverFirTotal +
            horseChestnutGroupScore;

        return {
            points: total,
            counts,
            detail: `beech(${counts.beech}) x ${counts.beech >= 4 ? 5 : 0} total = ${beechTotal} + birch(${counts.birch}) x 1 + douglas_fir(${counts.douglas_fir}) x 5 + sycamore(${counts.sycamore}) x ${plantedTrees} + oak(${counts.oak}) x ${uniqueTreeTypes >= 8 ? 10 : 0} (unique trees: ${uniqueTreeTypes}) + linden(${counts.linden}) total = ${lindenTotal} + great_spotted_woodpecker total = ${greatSpottedWoodpeckerTotal} + silver_fir(${counts.silver_fir}) attached x 2 total = ${silverFirTotal} + horse_chestnut(${counts.horse_chestnut}) group = ${horseChestnutGroupScore}`
        };
    },

    evaluate_tree_card(cardInput, boardObject, currentTree) {
        const speciesId = this.getSpeciesIdFromCard(cardInput);
        if (!speciesId) {
            return { points: 0, calculated: false, detail: 'Missing tree card id', ruleType: 'TREE_CASE' };
        }

        if (speciesId === 'beech') {
            const counts = this.getTreeSpeciesCounts(boardObject);
            const beechCount = counts.beech || 0;
            const active = beechCount >= 4;
            return {
                points: active ? this.treeCasesVp.beech : 0,
                calculated: true,
                detail: active
                    ? `Tree case: Beech active (${beechCount}) x 5`
                    : `Tree case: Beech inactive (${beechCount}/4)`,
                ruleType: 'TREE_CASE'
            };
        }

        if (speciesId === 'birch') {
            return { points: 1, calculated: true, detail: 'Tree case: Birch x 1', ruleType: 'TREE_CASE' };
        }

        if (speciesId === 'douglas_fir') {
            return { points: 5, calculated: true, detail: 'Tree case: Douglas Fir x 5', ruleType: 'TREE_CASE' };
        }

        if (speciesId === 'sycamore') {
            const plantedTrees = this.getPlantedTreeCount(boardObject);
            return {
                points: this.treeCasesVp.sycamore * plantedTrees,
                calculated: true,
                detail: `Tree case: Sycamore x ${plantedTrees} planted trees`,
                ruleType: 'TREE_CASE'
            };
        }

        if (speciesId === 'oak') {
            const uniqueTreeTypes = this.getUniquePlantedTreeTypeCount(boardObject);
            const uniqueTreeTypeIds = this.getUniquePlantedTreeTypeIds(boardObject);
            const hasAllEight = uniqueTreeTypes >= 8;
            return {
                points: hasAllEight ? this.treeCasesVp.oak : 0,
                calculated: true,
                detail: hasAllEight
                    ? `Tree case: Oak active (${uniqueTreeTypes} unique trees) x 10`
                    : `Tree case: Oak inactive (${uniqueTreeTypes}/8 unique trees)`,
                ruleType: 'TREE_CASE'
            };
        }

        if (speciesId === 'horse_chestnut') {
            const counts = this.getTreeSpeciesCounts(boardObject);
            const horseChestnutCount = counts.horse_chestnut || 0;
            const groupScore = this.getHorseChestnutGroupScore(horseChestnutCount);
            const leaderTreeId = this.getHorseChestnutLeaderTreeId(boardObject);
            const isLeader = !!(currentTree && currentTree.id && currentTree.id === leaderTreeId);

            if (isLeader) {
                return {
                    points: groupScore,
                    calculated: true,
                    detail: `Tree case: Horse Chestnut group ${horseChestnutCount} -> ${groupScore} (counted once)`,
                    ruleType: 'TREE_CASE'
                };
            }

            return {
                points: 0,
                calculated: true,
                detail: `Tree case: Horse Chestnut grouped score handled by one card (${horseChestnutCount} -> ${groupScore})`,
                ruleType: 'TREE_CASE'
            };
        }

        if (speciesId === 'linden') {
            const hasMost = !!(cardInput && cardInput.hasLindenMost);
            const points = hasMost ? 3 : 1;
            return {
                points,
                calculated: true,
                detail: hasMost ? 'Tree case: Linden (most) = 3' : 'Tree case: Linden (normal) = 1',
                ruleType: 'TREE_CASE'
            };
        }

        if (speciesId === 'great_spotted_woodpecker') {
            const hasMost = !!(cardInput && cardInput.hasMost);
            return {
                points: hasMost ? 10 : 0,
                calculated: true,
                detail: hasMost ? 'Tree case: Great Spotted Woodpecker (Most) = 10' : 'Tree case: Great Spotted Woodpecker inactive (Most unchecked)',
                ruleType: 'TREE_CASE'
            };
        }

        if (speciesId === 'silver_fir') {
            const attachedCount = currentTree
                ? (currentTree.top.length + currentTree.bottom.length + currentTree.left.length + currentTree.right.length)
                : 0;
            const points = attachedCount * this.treeCasesVp.silver_fir;
            return {
                points,
                calculated: true,
                detail: `Tree case: Silver Fir ${attachedCount} attached cards x 2 = ${points}`,
                ruleType: 'TREE_CASE'
            };
        }

        return { points: 0, calculated: false, detail: `Tree case not enabled: ${speciesId}`, ruleType: 'TREE_CASE' };
    },

    evaluate_top_bottom(boardObject) {
        const counts = { pond_turtle: 0, fire_salamander: 0, moss: 0, wild_strawberries: 0, tree_ferns: 0, firefly: 0, wood_ant: 0, tree_frog: 0, common_toad: 0, blackberries: 0, hedgehog: 0, stag_beetle: 0, fly_agaric: 0, chanterelle: 0, penny_bun: 0, parasol_mushroom: 0, mole: 0, eurasian_jay: 0, chaffinch: 0, red_squirrel: 0, butterfly: 0, bullfinch: 0, goshawk: 0 };
        let total = 0;
        const plantedTrees = this.getPlantedTreeCount(boardObject);
        const uniqueTreeTypes = this.getUniquePlantedTreeTypeCount(boardObject);
        const treeSpeciesCounts = this.getTreeSpeciesCounts(boardObject);
        const oakCount = treeSpeciesCounts.oak || 0;
        const birchCount = treeSpeciesCounts.birch || 0;
        const horseChestnutCount = treeSpeciesCounts.horse_chestnut || 0;
        const totalBottomCards = ((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []).length;

        const topBottomEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
        ];

        topBottomEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (cardId === 'pond_turtle') {
                counts.pond_turtle += 1;
                total += this.topBottomCasesVp.pond_turtle;
            }
            if (cardId === 'fire_salamander') {
                counts.fire_salamander += 1;
            }
            if (cardId === 'moss') {
                counts.moss += 1;
            }
            if (cardId === 'wild_strawberries') {
                counts.wild_strawberries += 1;
            }
            if (cardId === 'tree_ferns' || cardId === 'tree_fern') {
                counts.tree_ferns += 1;
            }
            if (cardId === 'firefly') {
                counts.firefly += 1;
            }
            if (cardId === 'wood_ant') {
                counts.wood_ant += 1;
            }
            if (cardId === 'tree_frog') {
                counts.tree_frog += 1;
            }
            if (cardId === 'common_toad') {
                counts.common_toad += 1;
            }
            if (cardId === 'blackberries') {
                counts.blackberries += 1;
            }
            if (cardId === 'hedgehog') {
                counts.hedgehog += 1;
            }
            if (cardId === 'stag_beetle') {
                counts.stag_beetle += 1;
            }
            if (cardId === 'fly_agaric') {
                counts.fly_agaric += 1;
            }
            if (cardId === 'chanterelle') {
                counts.chanterelle += 1;
            }
            if (cardId === 'penny_bun') {
                counts.penny_bun += 1;
            }
            if (cardId === 'parasol_mushroom') {
                counts.parasol_mushroom += 1;
            }
            if (cardId === 'mole') {
                counts.mole += 1;
            }
            if (cardId === 'eurasian_jay') {
                counts.eurasian_jay += 1;
            }
            if (cardId === 'chaffinch') {
                counts.chaffinch += 1;
            }
            if (cardId === 'red_squirrel') {
                counts.red_squirrel += 1;
            }
            if (this.getButterflyCardIds().has(cardId)) {
                counts.butterfly += 1;
            }
            if (cardId === 'bullfinch') {
                counts.bullfinch += 1;
            }
            if (cardId === 'goshawk') {
                counts.goshawk += 1;
            }
        });

        const fireSalamanderSetScore = counts.fire_salamander >= 3
            ? 25
            : (counts.fire_salamander === 2 ? 15 : (counts.fire_salamander === 1 ? 5 : 0));
        const mossTotal = plantedTrees >= 10 ? (counts.moss * this.topBottomCasesVp.moss) : 0;
        const wildStrawberriesTotal = uniqueTreeTypes >= 8 ? (counts.wild_strawberries * this.topBottomCasesVp.wild_strawberries) : 0;

        const reptileIds = new Set(['fire_salamander', 'pond_turtle', 'tree_frog', 'common_toad']);
        let reptileCount = 0;
        topBottomEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (reptileIds.has(cardId)) reptileCount += 1;
        });
        const treeFernsTotal = counts.tree_ferns * reptileCount * this.topBottomCasesVp.tree_ferns;
        const fireflySetScore = this.getFireflySetScore(counts.firefly);
        const woodAntTotal = counts.wood_ant * totalBottomCards * this.topBottomCasesVp.wood_ant;

        const attachedEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        ];
        let gnatCount = 0;
        attachedEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (entryId === 'gnat') gnatCount += 1;
        });
        const treeFrogTotal = counts.tree_frog * gnatCount * this.topBottomCasesVp.tree_frog;

        const blackberryPlantIds = new Set(['blackberries', 'tree_ferns', 'tree_fern', 'moss', 'wild_strawberries']);
        let blackberryPlantCount = 0;
        topBottomEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (blackberryPlantIds.has(entryId)) blackberryPlantCount += 1;
        });
        const blackberriesTotal = counts.blackberries * blackberryPlantCount * this.topBottomCasesVp.blackberries;

        const butterflyIds = this.getButterflyCardIds();
        const butterflySetScore = this.getButterflySetScore(counts.butterfly);
        const butterflyLeaderTreeId = this.getButterflyLeaderTreeId(boardObject);
        const isButterflyLeader = !!(butterflyLeaderTreeId);
        let butterflyTotal = 0;
        if (isButterflyLeader) butterflyTotal = butterflySetScore;

        const bullfinchInsectCount = this.getBullfinchInsectCount(boardObject);
        const bullfinchTotal = counts.bullfinch * bullfinchInsectCount * 2;

        const goshawkBirdCount = this.getGoshawkBirdCount(boardObject);
        const goshawkTotal = counts.goshawk * goshawkBirdCount * 3;

        let hedgehogButterflyCount = 0;
        attachedEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (butterflyIds.has(entryId)) hedgehogButterflyCount += 1;
        });
        const hedgehogTotal = counts.hedgehog * hedgehogButterflyCount * this.topBottomCasesVp.hedgehog;

        const stagBeetlePawedAnimalIds = this.getStagBeetlePawedAnimalIds();
        let stagBeetlePawedAnimalCount = 0;
        attachedEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (stagBeetlePawedAnimalIds.has(entryId)) stagBeetlePawedAnimalCount += 1;
        });
        const stagBeetleTotal = counts.stag_beetle * stagBeetlePawedAnimalCount * this.topBottomCasesVp.stag_beetle;
        const flyAgaricTotal = counts.fly_agaric * birchCount * this.topBottomCasesVp.fly_agaric;
        const chanterelleTotal = counts.chanterelle * oakCount * this.topBottomCasesVp.chanterelle;
        const pennyBunTotal = counts.penny_bun * horseChestnutCount * this.topBottomCasesVp.penny_bun;
        const eurasianJayTotal = counts.eurasian_jay * this.topBottomCasesVp.eurasian_jay;
        let redSquirrelTotal = 0;

        let chaffinchTotal = 0;
        Object.values((boardObject && boardObject.byTree) || {}).forEach((treeBuckets) => {
            const speciesCard = treeBuckets && treeBuckets.species && treeBuckets.species[0];
            const speciesId = this.getSpeciesIdFromCard(speciesCard);
            if (speciesId === 'beech') {
                const chaffinchesOnBeech = ((treeBuckets && treeBuckets.top) || []).reduce((acc, card) => {
                    const id = Helpers.normalizeName(card && (card.cardId || card.name));
                    return acc + (id === 'chaffinch' ? 1 : 0);
                }, 0);
                chaffinchTotal += chaffinchesOnBeech * this.topBottomCasesVp.chaffinch;
            }

            if (speciesId === 'oak') {
                const redSquirrelsOnOak = ((treeBuckets && treeBuckets.top) || []).reduce((acc, card) => {
                    const id = Helpers.normalizeName(card && (card.cardId || card.name));
                    return acc + (id === 'red_squirrel' ? 1 : 0);
                }, 0);
                redSquirrelTotal += redSquirrelsOnOak * this.topBottomCasesVp.red_squirrel;
            }
        });

        let commonToadTotal = 0;
        Object.values((boardObject && boardObject.byTree) || {}).forEach((treeBuckets) => {
            const bottomCards = (treeBuckets && treeBuckets.bottom) || [];
            const bottomCommonToads = bottomCards.reduce((acc, card) => {
                const id = Helpers.normalizeName(card && (card.cardId || card.name));
                return acc + (id === 'common_toad' ? 1 : 0);
            }, 0);
            if (bottomCommonToads >= 2) {
                commonToadTotal += bottomCommonToads * this.topBottomCasesVp.common_toad;
            }
        });

        total += fireSalamanderSetScore;
        total += mossTotal;
        total += wildStrawberriesTotal;
        total += treeFernsTotal;
        total += butterflyTotal;
        total += bullfinchTotal;
        total += goshawkTotal;
        total += fireflySetScore;
        total += woodAntTotal;
        total += treeFrogTotal;
        total += commonToadTotal;
        total += blackberriesTotal;
        total += hedgehogTotal;
        total += stagBeetleTotal;
        total += flyAgaricTotal;
        total += chanterelleTotal;
        total += pennyBunTotal;
        total += eurasianJayTotal;
        total += chaffinchTotal;
        total += redSquirrelTotal;

        return {
            points: total,
            counts,
            detail: `pond_turtle(${counts.pond_turtle}) x 5 + fire_salamander set(${counts.fire_salamander}) = ${fireSalamanderSetScore} + moss(${counts.moss}) x ${plantedTrees >= 10 ? 10 : 0} (trees: ${plantedTrees}) = ${mossTotal} + wild_strawberries(${counts.wild_strawberries}) x ${uniqueTreeTypes >= 8 ? 10 : 0} (unique trees: ${uniqueTreeTypes}) = ${wildStrawberriesTotal} + tree_ferns(${counts.tree_ferns}) x reptiles(${reptileCount}) x 6 = ${treeFernsTotal} + butterfly set(${counts.butterfly}) = ${butterflyTotal} + bullfinch(${counts.bullfinch}) x insects(${bullfinchInsectCount}) x 2 = ${bullfinchTotal} + goshawk(${counts.goshawk}) x birds(${goshawkBirdCount}) x 3 = ${goshawkTotal} + firefly set(${counts.firefly}) = ${fireflySetScore} + wood_ant(${counts.wood_ant}) x bottom_cards(${totalBottomCards}) x 2 = ${woodAntTotal} + tree_frog(${counts.tree_frog}) x gnat(${gnatCount}) x 5 = ${treeFrogTotal} + common_toad paired bottoms = ${commonToadTotal} + blackberries(${counts.blackberries}) x plants(${blackberryPlantCount}) x 2 = ${blackberriesTotal} + hedgehog(${counts.hedgehog}) x butterflies(${hedgehogButterflyCount}) x 2 = ${hedgehogTotal} + stag_beetle(${counts.stag_beetle}) x pawed_animals(${stagBeetlePawedAnimalCount}) x 1 = ${stagBeetleTotal} + fly_agaric(${counts.fly_agaric}) x birch(${birchCount}) x 3 = ${flyAgaricTotal} + chanterelle(${counts.chanterelle}) x oak(${oakCount}) x 5 = ${chanterelleTotal} + penny_bun(${counts.penny_bun}) x horse_chestnut(${horseChestnutCount}) x 4 = ${pennyBunTotal} + eurasian_jay(${counts.eurasian_jay}) = ${eurasianJayTotal} + chaffinch(${counts.chaffinch}) on beech = ${chaffinchTotal} + red_squirrel(${counts.red_squirrel}) on oak = ${redSquirrelTotal} + parasol_mushroom(${counts.parasol_mushroom}) x 0 + mole(${counts.mole}) x 0`
        };
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
        const counts = { squeeker: 0, badger: 0, red_fox: 0, european_hare: 0, beech_marten: 0, wild_boar: 0, lynx: 0, roe_deer: 0, red_deer: 0, fallow_deer: 0, wolf: 0, gnat: 0 };
        let total = 0;
        const sideEntries = [
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
            ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        ];
        const fullTreeCount = this.getFullyOccupiedTreeCount(boardObject);
        const plantedTreeCount = this.getPlantedTreeCount(boardObject);
        const redDeerPlantCount = this.getRedDeerPlantCount(boardObject);
        const clovenHoofedCount = this.getClovenHoofedAnimalCount(boardObject);
        const batStats = this.getBatScoringStats(boardObject);
        const batCount = this.getBatCardCount(boardObject);
        const blueTypeCount = this.getColorTypeCardCount(boardObject, 'blue', 'silver_fir');
        const yellowTypeCount = this.getColorTypeCardCount(boardObject, 'yellow', 'linden');
        const greenTypeCount = this.getColorTypeCardCount(boardObject, 'green', 'beech');
        const limeTypeCount = this.getColorTypeCardCount(boardObject, 'lime', null);

        sideEntries.forEach((entry) => {
            if (!entry || !entry.card) return;
            const cardId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
            if (cardId === 'squeeker') {
                counts.squeeker += 1;
                total += 1;
            }
            if (cardId === 'badger') {
                counts.badger += 1;
                total += 2;
            }
            if (cardId === 'red_fox') {
                counts.red_fox += 1;
            }
            if (cardId === 'european_hare') {
                counts.european_hare += 1;
            }
            if (cardId === 'beech_marten') {
                counts.beech_marten += 1;
                total += fullTreeCount * 5;
            }
            if (cardId === 'wild_boar') {
                counts.wild_boar += 1;
            }
            if (cardId === 'lynx') {
                counts.lynx += 1;
            }
            if (cardId === 'wolf') {
                counts.wolf += 1;
            }
            if (cardId === 'red_deer') {
                counts.red_deer += 1;
            }
            if (cardId === 'fallow_deer') {
                counts.fallow_deer += 1;
            }
            if (cardId === 'gnat') {
                counts.gnat += 1;
            }
            if (cardId === 'roe_deer') {
                counts.roe_deer += 1;
                const colors = (entry.card && entry.card.colors) || [];
                const isBlueRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'blue');
                const isYellowRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'yellow');
                const isGreenRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'green');
                const isLimeRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'lime');
                if (isBlueRoeDeer) {
                    total += blueTypeCount * 3;
                } else if (isYellowRoeDeer) {
                    total += yellowTypeCount * 3;
                } else if (isGreenRoeDeer) {
                    total += greenTypeCount * 3;
                } else if (isLimeRoeDeer) {
                    total += limeTypeCount * 3;
                }
            }
        });

        total += counts.european_hare * counts.european_hare;
        total += counts.red_fox * counts.european_hare * 2;
        total += counts.red_deer * (redDeerPlantCount + plantedTreeCount);
        total += counts.fallow_deer * clovenHoofedCount * 3;
        total += counts.wolf * (counts.roe_deer + counts.red_deer + counts.fallow_deer) * 5;
        total += counts.gnat * batCount;
        if (batStats.active) {
            total += batStats.totalBatCards * 5;
        }
        if (counts.squeeker > 0) {
            total += counts.wild_boar * 10;
        }
        if (counts.roe_deer > 0) {
            total += counts.lynx * 10;
        }

        return {
            points: total,
            counts,
            detail: `squeeker(${counts.squeeker}) x 1 + badger(${counts.badger}) x 2 + european_hare(${counts.european_hare}) x european_hare(${counts.european_hare}) x 1 + red_fox(${counts.red_fox}) x european_hare(${counts.european_hare}) x 2 + red_deer(${counts.red_deer}) x [plants(${redDeerPlantCount}) + trees(${plantedTreeCount})] + fallow_deer(${counts.fallow_deer}) x cloven_hoofed(${clovenHoofedCount}) x 3 + wolf(${counts.wolf}) x deer(${counts.roe_deer + counts.red_deer + counts.fallow_deer}) x 5 + gnat(${counts.gnat}) x bats(${batCount}) x 1 + bats(${batStats.totalBatCards}) x active(${batStats.active ? 1 : 0}) x 5 (distinct_bats=${batStats.distinctBatTypes}) + beech_marten(${counts.beech_marten}) x full_trees(${fullTreeCount}) x 5 + wild_boar(${counts.wild_boar}) x squeeker(${counts.squeeker > 0 ? 1 : 0}) x 10 + lynx(${counts.lynx}) x roe_deer(${counts.roe_deer > 0 ? 1 : 0}) x 10 + roe_deer_blue_cards(${blueTypeCount}) x 3 + roe_deer_yellow_cards(${yellowTypeCount}) x 3 + roe_deer_green_cards(${greenTypeCount}) x 3 + roe_deer_lime_cards(${limeTypeCount}) x 3 = ${total}`
        };
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
    },git 

    evaluateDetailed(cardInput, forestState, currentTree) {
        const cardName = typeof cardInput === 'string' ? cardInput : (cardInput && cardInput.name);
        const boardObject = this.getAllCardsObject(forestState);
        // console.log('[BOARD_DEBUG]', boardObject);
        if (!cardName) {
            return {
                points: 0,
                calculated: false,
                cardName: 'Unknown',
                detail: 'Missing card name',
                ruleType: null
            };
        }

        // Tree-first rollout requested: species card uses dedicated tree cases only.
        const isSpeciesCard = !!(currentTree && typeof cardInput === 'object' && currentTree.species === cardInput);
        if (isSpeciesCard) {
            const treeResult = this.evaluate_tree_card(cardInput, boardObject, currentTree);
            return {
                points: treeResult.points,
                calculated: treeResult.calculated,
                cardName,
                detail: treeResult.detail,
                ruleType: treeResult.ruleType
            };
        }

        const isTopBottomCard = !!(currentTree && typeof cardInput === 'object' && (
            currentTree.top.includes(cardInput) || currentTree.bottom.includes(cardInput)
        ));
        if (isTopBottomCard) {
            const topBottomResult = this.evaluate_top_bottom_card(cardInput, boardObject, currentTree);
            return {
                points: topBottomResult.points,
                calculated: topBottomResult.calculated,
                cardName,
                detail: topBottomResult.detail,
                ruleType: topBottomResult.ruleType
            };
        }

        const isSideCard = !!(currentTree && typeof cardInput === 'object' && (
            currentTree.left.includes(cardInput) || currentTree.right.includes(cardInput)
        ));
        if (isSideCard) {
            const sideResult = this.evaluate_side_card(cardInput, boardObject, currentTree);
            return {
                points: sideResult.points,
                calculated: sideResult.calculated,
                cardName,
                detail: sideResult.detail,
                ruleType: sideResult.ruleType
            };
        }

        // Non-species cards are temporarily disabled while tree cases are being built.
        const rule = this.resolveRuleForCard(cardInput);
        if (!rule) {
            return {
                points: 0,
                calculated: false,
                cardName,
                detail: 'Non-tree scoring temporarily disabled',
                ruleType: null
            };
        }

        const cardsObject = this.getAllCardsObject(forestState);
        const boardResult = this.evaluate_tree(cardsObject);
        void boardResult;
        void currentTree;

        return {
            points: 0,
            calculated: false,
            cardName,
            detail: `Non-tree scoring disabled: ${rule.ruleType}`,
            ruleType: rule.ruleType
        };
    },

    evaluate(cardInputOrBoard, forestState, currentTree) {
        if (cardInputOrBoard && typeof cardInputOrBoard === 'object' && cardInputOrBoard.byTree) {
            return this.evaluate_tree(cardInputOrBoard).points + this.evaluate_top_bottom(cardInputOrBoard).points + this.evaluate_sides(cardInputOrBoard).points;
        }
        return this.evaluateDetailed(cardInputOrBoard, forestState, currentTree).points;
    }
};
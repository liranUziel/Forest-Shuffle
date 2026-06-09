const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const cardsDb = JSON.parse(fs.readFileSync(path.join(root, 'cards.json'), 'utf8'));
const pointsSource = fs.readFileSync(path.join(root, 'points.js'), 'utf8');

const context = { console, globalThis: {} };
vm.createContext(context);
vm.runInContext(`${pointsSource}\n;globalThis.__ScoringEngine = ScoringEngine;`, context);
const ScoringEngine = context.globalThis.__ScoringEngine;

if (!ScoringEngine || typeof ScoringEngine.registerRules !== 'function') {
    throw new Error('ScoringEngine not loaded correctly from points.js');
}

ScoringEngine.registerRules(cardsDb);

function mkTree(id) {
    return { id, species: null, top: [], bottom: [], left: [], right: [] };
}

function placeCard(tree, slot, card) {
    if (slot === 'species') tree.species = card;
    else tree[slot].push(card);
}

function allRules() {
    const out = [];
    Object.entries(cardsDb).forEach(([category, cards]) => {
        Object.entries(cards).forEach(([cardId, rule]) => {
            out.push({ category, cardId, rule });
        });
    });
    return out;
}

const rules = allRules();
const ruleById = Object.fromEntries(rules.map((r) => [r.cardId, r]));
const expectedPointOverrides = {
    badger: 2,
    european_badger: 2
};

function cardFromRule(ruleEntry) {
    return {
        name: ruleEntry.rule.name,
        cardId: ruleEntry.cardId,
        symbols: Array.isArray(ruleEntry.rule.symbols) ? ruleEntry.rule.symbols : [],
        ruleType: ruleEntry.rule.ruleType
    };
}

function sourceSlotForCategory(category) {
    if (category === 'trees') return 'species';
    if (category === 'sides') return 'left';
    return category;
}

function findRuleBySymbol(symbol, excludeCardId) {
    return rules.find((entry) => {
        if (entry.cardId === excludeCardId) return false;
        const symbols = entry.rule.symbols || [];
        return symbols.includes(symbol);
    });
}

function findAnyRule(excludeCardId) {
    return rules.find((entry) => entry.cardId !== excludeCardId);
}

function assertEqual(name, actual, expected, detail) {
    if (actual !== expected) {
        return { pass: false, name, actual, expected, detail };
    }
    return { pass: true, name, actual, expected, detail };
}

function runRuleCase(ruleEntry) {
    const { rule, cardId, category } = ruleEntry;
    const sourceSlot = sourceSlotForCategory(category);
    const sourceCard = cardFromRule(ruleEntry);
    const treeA = mkTree('A');
    const forest = [treeA];
    placeCard(treeA, sourceSlot, sourceCard);

    let expected;
    let detail = '';

    switch (rule.ruleType) {
        case 'FLAT_POINT': {
            expected = Object.prototype.hasOwnProperty.call(expectedPointOverrides, cardId)
                ? expectedPointOverrides[cardId]
                : Number(rule.points || 0);
            detail = 'flat';
            break;
        }

        case 'MULTIPLY_SYMBOL': {
            const target = findRuleBySymbol(rule.targetSymbol, cardId);
            if (!target) {
                return { skip: true, name: rule.name, reason: `No target with symbol ${rule.targetSymbol}` };
            }
            placeCard(treeA, 'right', cardFromRule(target));
            placeCard(treeA, 'bottom', cardFromRule(target));
            const sourceHasTarget = (rule.symbols || []).includes(rule.targetSymbol) ? 1 : 0;
            const count = sourceHasTarget + 2;
            expected = count * Number(rule.multiplier || 0);
            detail = `${count} ${rule.targetSymbol} x ${rule.multiplier}`;
            break;
        }

        case 'MULTIPLY_CARDS_ON_OWN_TREE': {
            const filler = findAnyRule(cardId);
            if (!filler) {
                return { skip: true, name: rule.name, reason: 'No filler card found' };
            }
            placeCard(treeA, 'right', cardFromRule(filler));
            placeCard(treeA, 'bottom', cardFromRule(filler));
            const ownCount = treeA.top.length + treeA.bottom.length + treeA.left.length + treeA.right.length;
            expected = ownCount * Number(rule.multiplier || 0);
            detail = `${ownCount} own cards x ${rule.multiplier}`;
            break;
        }

        case 'MULTIPLY_ALL_CARDS': {
            if (rule.name === 'Bullfinch') {
                const insect = findRuleBySymbol('insect', cardId);
                if (!insect) return { skip: true, name: rule.name, reason: 'No insect card found' };
                placeCard(treeA, 'right', cardFromRule(insect));
                placeCard(treeA, 'bottom', cardFromRule(insect));
                expected = 2 * 2;
                detail = 'Bullfinch override: insects(2) x 2';
                break;
            }

            const filler = findAnyRule(cardId);
            if (!filler) {
                return { skip: true, name: rule.name, reason: 'No filler card found' };
            }
            placeCard(treeA, 'right', cardFromRule(filler));
            const allCount = 2;
            expected = allCount * Number(rule.multiplier || 0);
            detail = `${allCount} total cards x ${rule.multiplier}`;
            break;
        }

        case 'MULTIPLY_TREE_SPECIES': {
            const targetTreeRule = ruleById[rule.targetTree];
            if (!targetTreeRule) {
                return { skip: true, name: rule.name, reason: `Missing target tree ${rule.targetTree}` };
            }
            const treeB = mkTree('B');
            const treeC = mkTree('C');
            forest.push(treeB, treeC);
            placeCard(treeB, 'species', cardFromRule(targetTreeRule));
            placeCard(treeC, 'species', cardFromRule(targetTreeRule));
            expected = 2 * Number(rule.multiplier || 0);
            detail = `2 ${rule.targetTree} trees x ${rule.multiplier}`;
            break;
        }

        case 'MULTIPLY_SPECIFIC_CARD': {
            const targetCardRule = ruleById[rule.targetCardId];
            if (!targetCardRule) {
                return { skip: true, name: rule.name, reason: `Missing target card ${rule.targetCardId}` };
            }
            placeCard(treeA, 'right', cardFromRule(targetCardRule));
            const treeB = mkTree('B');
            forest.push(treeB);
            placeCard(treeB, 'left', cardFromRule(targetCardRule));
            expected = 2 * Number(rule.multiplier || 0);
            detail = `2 ${rule.targetCardId} x ${rule.multiplier}`;
            break;
        }

        case 'CONDITIONAL_TREE_PRESENCE': {
            const targetTreeRule = ruleById[rule.targetTree];
            if (!targetTreeRule) {
                expected = Number(rule.pointsIfFalse || 0);
                detail = `${rule.targetTree} missing`;
            } else {
                const treeB = mkTree('B');
                forest.push(treeB);
                placeCard(treeB, 'species', cardFromRule(targetTreeRule));
                expected = Number(rule.pointsIfTrue || 0);
                detail = `${rule.targetTree} present`;
            }
            break;
        }

        default:
            return { skip: true, name: rule.name, reason: `Unsupported ruleType ${rule.ruleType}` };
    }

    const actual = ScoringEngine.evaluateDetailed(sourceCard, forest, treeA).points;
    return assertEqual(`${rule.name} (${rule.ruleType})`, actual, expected, detail);
}

const results = rules.map(runRuleCase);

// Explicit regression checks requested by user
const badgerCheck = (() => {
    const forest = [mkTree('A')];
    const card = { name: 'European Badger', cardId: 'european_badger', symbols: ['paw'], ruleType: 'FLAT_POINT' };
    placeCard(forest[0], 'left', card);
    const actual = ScoringEngine.evaluateDetailed(card, forest, forest[0]).points;
    return assertEqual('European Badger override', actual, 2, 'flat 2 override');
})();

const bullfinchCheck = (() => {
    const forest = [mkTree('A')];
    const bullfinch = { name: 'Bullfinch', cardId: 'bullfinch', symbols: ['bird'], ruleType: 'MULTIPLY_ALL_CARDS' };
    const insect = rules.find((r) => (r.rule.symbols || []).includes('insect'));
    placeCard(forest[0], 'top', bullfinch);
    if (insect) placeCard(forest[0], 'left', cardFromRule(insect));
    const actual = ScoringEngine.evaluateDetailed(bullfinch, forest, forest[0]).points;
    return assertEqual('Bullfinch bug/insect x2', actual, insect ? 2 : 0, '1 insect => 2 points');
})();

results.push(badgerCheck, bullfinchCheck);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => r.pass === false);
const skipped = results.filter((r) => r.skip);

console.log('--- Scoring Case Test Summary ---');
console.log(`Total cases: ${results.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed.length}`);
console.log(`Skipped: ${skipped.length}`);

if (failed.length > 0) {
    console.log('\nFailed cases:');
    failed.forEach((f) => {
        console.log(`- ${f.name}: expected ${f.expected}, got ${f.actual} (${f.detail})`);
    });
}

if (skipped.length > 0) {
    console.log('\nSkipped cases:');
    skipped.forEach((s) => {
        console.log(`- ${s.name}: ${s.reason}`);
    });
}

process.exit(failed.length > 0 ? 1 : 0);

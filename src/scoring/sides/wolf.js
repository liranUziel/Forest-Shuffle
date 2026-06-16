// src/scoring/cards/sides/wolf.js

export const scoreWolf = (cardInput, boardObject, currentTree, helpers, engine) => {
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const deer = sideEntries.filter(entry => {
        if (!entry?.card) return false;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        return entryId === 'roe_deer' || entryId === 'red_deer' || entryId === 'fallow_deer';
    }).map(entry => entry.card);
    const deerCount = deer.length;
    const points = deerCount * 5;

    return {
        points,
        calculated: true,
        detail: `Side case: Wolf deer(${deerCount}) x 5 = ${points}`,
        ruleType: 'SIDE_CASE',
        contributors: deer,
    };
};
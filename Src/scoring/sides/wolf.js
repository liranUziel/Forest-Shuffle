// src/scoring/cards/sides/wolf.js

export const scoreWolf = (cardInput, boardObject, currentTree, helpers, engine) => {
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const deerCount = sideEntries.reduce((acc, entry) => {
        if (!entry || !entry.card) return acc;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        return acc + (entryId === 'roe_deer' || entryId === 'red_deer' || entryId === 'fallow_deer' ? 1 : 0);
    }, 0);
    const points = deerCount * 5;

    return {
        points,
        calculated: true,
        detail: `Side case: Wolf deer(${deerCount}) x 5 = ${points}`,
        ruleType: 'SIDE_CASE'
    };
};
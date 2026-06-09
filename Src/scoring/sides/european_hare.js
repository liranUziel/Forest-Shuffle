// src/scoring/cards/sides/european_hare.js

// Updated to accept the 4 standard arguments in the correct order!
export const scoreEuropeanHare = (cardInput, boardObject, currentTree, helpers) => {
    
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    
    const hareCount = sideEntries.reduce((acc, entry) => {
        if (!entry || !entry.card) return acc;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        return acc + (entryId === 'european_hare' ? 1 : 0);
    }, 0);

    return {
        points: hareCount,
        calculated: true,
        detail: `Side case: European Hare european_hare(${hareCount}) x 1 = ${hareCount}`,
        ruleType: 'SIDE_CASE'
    };
};
// src/scoring/cards/sides/red_fox.js

export const scoreRedFox = (cardInput, boardObject, currentTree, helpers) => {
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    
    const europeanHareCount = sideEntries.reduce((acc, entry) => {
        if (!entry || !entry.card) return acc;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        return acc + (entryId === 'european_hare' ? 1 : 0);
    }, 0);

    return {
        points: europeanHareCount * 2,
        calculated: true,
        detail: `Side case: Red Fox european_hare(${europeanHareCount}) x 2 = ${europeanHareCount * 2}`,
        ruleType: 'SIDE_CASE'
    };
};
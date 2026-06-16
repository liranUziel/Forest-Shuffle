// src/scoring/cards/sides/red_fox.js

export const scoreRedFox = (cardInput, boardObject, currentTree, helpers) => {
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    
    const hares = sideEntries.filter(entry =>
        entry?.card && helpers.normalizeName(entry.card.cardId || entry.card.name) === 'european_hare'
    ).map(entry => entry.card);
    const europeanHareCount = hares.length;

    return {
        points: europeanHareCount * 2,
        calculated: true,
        detail: `Side case: Red Fox european_hare(${europeanHareCount}) x 2 = ${europeanHareCount * 2}`,
        ruleType: 'SIDE_CASE',
        contributors: hares,
    };
};
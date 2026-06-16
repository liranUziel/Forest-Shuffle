// src/scoring/cards/sides/wild_boar.js

export const scoreWildBoar = (cardInput, boardObject, currentTree, helpers, engine) => {
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const squeekers = sideEntries.filter(entry =>
        entry?.card && helpers.normalizeName(entry.card.cardId || entry.card.name) === 'squeeker'
    ).map(entry => entry.card);
    const hasSqueeker = squeekers.length > 0;

    return {
        points: hasSqueeker ? 10 : 0,
        calculated: true,
        detail: hasSqueeker
            ? 'Side case: Wild Boar with Squeeker present = 10'
            : 'Side case: Wild Boar inactive (no Squeeker present)',
        ruleType: 'SIDE_CASE',
        contributors: squeekers,
    };
};
// src/scoring/cards/sides/wild_boar.js

export const scoreWildBoar = (cardInput, boardObject, currentTree, helpers, engine) => {
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const hasSqueeker = sideEntries.some((entry) => {
        if (!entry || !entry.card) return false;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        return entryId === 'squeeker';
    });

    return {
        points: hasSqueeker ? 10 : 0,
        calculated: true,
        detail: hasSqueeker
            ? 'Side case: Wild Boar with Squeeker present = 10'
            : 'Side case: Wild Boar inactive (no Squeeker present)',
        ruleType: 'SIDE_CASE'
    };
};
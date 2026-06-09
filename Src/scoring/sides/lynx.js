// src/scoring/cards/sides/lynx.js

export const scoreLynx = (cardInput, boardObject, currentTree, helpers) => {
    const sideEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    
    const hasRoeDeer = sideEntries.some((entry) => {
        if (!entry || !entry.card) return false;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        return entryId === 'roe_deer';
    });

    return {
        points: hasRoeDeer ? 10 : 0,
        calculated: true,
        detail: hasRoeDeer
            ? 'Side case: Lynx with Roe Deer present = 10'
            : 'Side case: Lynx inactive (no Roe Deer present)',
        ruleType: 'SIDE_CASE'
    };
};
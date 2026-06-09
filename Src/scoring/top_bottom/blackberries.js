// src/scoring/top_bottom/blackberries.js
export const scoreBlackberries = (cardInput, boardObject, currentTree, helpers, engine) => {
    const topBottomEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
    ];
    const blackberryPlantIds = new Set(['blackberries', 'tree_ferns', 'tree_fern', 'moss', 'wild_strawberries']);
    let blackberryPlantCount = 0;
    topBottomEntries.forEach((entry) => {
        if (!entry || !entry.card) return;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        if (blackberryPlantIds.has(entryId)) blackberryPlantCount += 1;
    });

    const points = blackberryPlantCount * engine.topBottomCasesVp.blackberries;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Blackberries plants(${blackberryPlantCount}) x 2 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
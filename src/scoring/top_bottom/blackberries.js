// src/scoring/top_bottom/blackberries.js
export const scoreBlackberries = (cardInput, boardObject, currentTree, helpers, engine) => {
    const topBottomEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
    ];
    const blackberryPlantIds = new Set(['blackberries', 'tree_ferns', 'tree_fern', 'moss', 'wild_strawberries']);
    const plants = topBottomEntries.filter(entry =>
        entry?.card && blackberryPlantIds.has(helpers.normalizeName(entry.card.cardId || entry.card.name))
    ).map(entry => entry.card);
    const blackberryPlantCount = plants.length;

    const points = blackberryPlantCount * engine.topBottomCasesVp.blackberries;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Blackberries plants(${blackberryPlantCount}) x 2 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: plants,
    };
};
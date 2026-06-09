// src/scoring/top_bottom/wild_strawberries.js
export const scoreWildStrawberries = (cardInput, boardObject, currentTree, helpers, engine) => {
    const uniqueTreeTypes = engine.getUniquePlantedTreeTypeCount(boardObject);
    const active = uniqueTreeTypes >= 8;
    return {
        points: active ? engine.topBottomCasesVp.wild_strawberries : 0,
        calculated: true,
        detail: active
            ? `Top/Bottom case: Wild Strawberries active (${uniqueTreeTypes} unique trees) x 10`
            : `Top/Bottom case: Wild Strawberries inactive (${uniqueTreeTypes}/8 unique trees)`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
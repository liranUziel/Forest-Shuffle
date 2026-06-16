// src/scoring/top_bottom/moss.js
export const scoreMoss = (cardInput, boardObject, currentTree, helpers, engine) => {
    const { count: plantedTrees, cards } = engine.getPlantedTreeCount(boardObject);
    const active = plantedTrees >= 10;
    return {
        points: active ? engine.topBottomCasesVp.moss : 0,
        calculated: true,
        detail: active
            ? `Top/Bottom case: Moss active (${plantedTrees} trees) x 10`
            : `Top/Bottom case: Moss inactive (${plantedTrees}/10 trees)`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: cards,
    };
};
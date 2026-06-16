// src/scoring/top_bottom/fly_agaric.js
export const scoreFlyAgaric = (cardInput, boardObject, currentTree, helpers, engine) => {
    const birchTrees = engine.getTreesOfSpecies(boardObject, 'birch');
    const birchCount = birchTrees.length;
    const points = birchCount * engine.topBottomCasesVp.fly_agaric;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Fly Agaric birch(${birchCount}) x 3 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: birchTrees,
    };
};
// src/scoring/top_bottom/chanterelle.js
export const scoreChanterelle = (cardInput, boardObject, currentTree, helpers, engine) => {
    const oakCount = (engine.getTreeSpeciesCounts(boardObject).oak || 0);
    const points = oakCount * engine.topBottomCasesVp.chanterelle;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Chanterelle oak(${oakCount}) x 5 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
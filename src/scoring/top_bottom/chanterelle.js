export const scoreChanterelle = (cardInput, boardObject, currentTree, helpers, engine) => {
    const oakCount = engine.getTreeSpeciesCounts(boardObject).oak ?? 0;
    const points = oakCount * 5;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom: Chanterelle oak(${oakCount}) × 5 = ${points} VP`,
        ruleType: 'TOP_BOTTOM_CASE',
    };
};

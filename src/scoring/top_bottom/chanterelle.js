export const scoreChanterelle = (cardInput, boardObject, currentTree, helpers, engine) => {
    const oakTrees = engine.getTreesOfSpecies(boardObject, 'oak');
    const oakCount = oakTrees.length;
    const points = oakCount * 5;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom: Chanterelle oak(${oakCount}) × 5 = ${points} VP`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: oakTrees,
    };
};

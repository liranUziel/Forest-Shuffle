// src/scoring/trees/sycamore.js
export const scoreSycamore = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Utilize the engine's built-in tree counter
    const { count: treeCount, cards } = engine.getPlantedTreeCount(boardObject);

    return {
        points: treeCount,
        calculated: true,
        detail: `Tree: Sycamore (${treeCount} total trees) = ${treeCount} VP`,
        ruleType: 'TREE',
        contributors: cards,
    };
};
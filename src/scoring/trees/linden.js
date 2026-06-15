// src/scoring/trees/linden.js
export const scoreLinden = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Check the boolean flag injected by your UI checkbox
    const hasMost = cardInput.hasLindenMost === true;
    const points = hasMost ? 3 : 1;

    return {
        points: points,
        calculated: true,
        detail: `Tree: Linden (Most Lindens: ${hasMost ? 'Yes' : 'No'}) = ${points} VP`,
        ruleType: 'TREE'
    };
};
// src/scoring/trees/linden.js
export const scoreLinden = (cardInput, boardObject, currentTree, helpers, engine) => {
    return {
        points: 1, // Base linden points
        calculated: true,
        detail: `Tree: Linden = 1`,
        ruleType: 'TREE'
    };
};
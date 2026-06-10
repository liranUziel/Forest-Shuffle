// src/scoring/trees/sycamore.js
export const scoreSycamore = (cardInput, boardObject, currentTree, helpers, engine) => {
    return {
        points: 1,
        calculated: true,
        detail: `Tree: Sycamore = 1`,
        ruleType: 'TREE'
    };
};
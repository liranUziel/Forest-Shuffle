// src/scoring/trees/oak.js
export const scoreOak = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Oak usually relies on having 8 different types of cards attached, or it's just worth 0 base.
    // Replace this with your exact old Oak math!
    return {
        points: 0, 
        calculated: true,
        detail: `Tree: Oak = 0`,
        ruleType: 'TREE'
    };
};
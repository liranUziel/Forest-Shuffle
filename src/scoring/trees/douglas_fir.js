// src/scoring/trees/douglas_fir.js
export const scoreDouglasFir = (cardInput, boardObject, currentTree, helpers, engine) => {
    return {
        points: 5,
        calculated: true,
        detail: `Tree: Douglas Fir = 5`,
        ruleType: 'TREE'
    };
};
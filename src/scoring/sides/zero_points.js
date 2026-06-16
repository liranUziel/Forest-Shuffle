// src/scoring/sides/zero_points.js
export const scoreZeroPoints = (cardInput, boardObject, currentTree, helpers, engine) => {
    const name = cardInput.name || "Card";
    return {
        points: 0,
        calculated: true,
        detail: `Side case: ${name} has no individual scoring ability — 0 VP`,
        ruleType: 'SIDE_CASE'
    };
};

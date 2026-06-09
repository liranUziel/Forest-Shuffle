// src/scoring/top_bottom/zero_points.js
export const scoreZeroPoints = (cardInput, boardObject, currentTree, helpers, engine) => {
    const name = cardInput.name || "Card";
    return {
        points: 0,
        calculated: true,
        detail: `Top/Bottom case: ${name} currently 0 VP`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
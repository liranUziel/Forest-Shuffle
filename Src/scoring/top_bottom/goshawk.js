// src/scoring/top_bottom/goshawk.js
export const scoreGoshawk = (cardInput, boardObject, currentTree, helpers, engine) => {
    const birdCount = engine.getGoshawkBirdCount(boardObject);
    const points = birdCount * 3;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Goshawk birds(${birdCount}) x 3 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
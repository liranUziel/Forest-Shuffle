// src/scoring/top_bottom/bullfinch.js
export const scoreBullfinch = (cardInput, boardObject, currentTree, helpers, engine) => {
    const { count: insectCount, cards } = engine.getBullfinchInsectCount(boardObject);
    const points = insectCount * 2;

    return {
        points: points,
        calculated: true,
        detail: `Top/Bottom case: Bullfinch (${insectCount} Insects x 2) = ${points} VP`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: cards,
    };
};
// src/scoring/top_bottom/bullfinch.js
export const scoreBullfinch = (cardInput, boardObject, currentTree, helpers, engine) => {
    const insectCount = engine.getBullfinchInsectCount(boardObject);
    const points = insectCount * 2;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Bullfinch insects(${insectCount}) x 2 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
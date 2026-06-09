// src/scoring/cards/top_bottom/eurasian_jay.js
export const scoreEurasianJay = (cardInput, boardObject, currentTree, helpers, engine) => {
    return {
        points: engine.topBottomCasesVp.eurasian_jay,
        calculated: true,
        detail: 'Top/Bottom case: Eurasian Jay = 3',
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
// src/scoring/cards/top_bottom/pond_turtle.js
export const scorePondTurtle = (cardInput, boardObject, currentTree, helpers, engine) => {
    return {
        points: engine.topBottomCasesVp.pond_turtle,
        calculated: true,
        detail: 'Top/Bottom case: Pond Turtle x 5',
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
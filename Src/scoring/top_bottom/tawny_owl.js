// src/scoring/cards/top_bottom/tawny_owl.js
export const scoreTawnyOwl = (cardInput, boardObject, currentTree, helpers, engine) => {
    return {
        points: 5,
        calculated: true,
        detail: 'Top/Bottom case: Tawny Owl = 5',
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
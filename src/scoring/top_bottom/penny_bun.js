// src/scoring/top_bottom/penny_bun.js
export const scorePennyBun = (cardInput, boardObject, currentTree, helpers, engine) => {
    // "None" means no special scaling rule. Just return its base value.
    const points = engine.topBottomCasesVp.penny_bun || 4;
    
    return {
        points: points,
        calculated: true,
        detail: `Top/Bottom case: Penny Bun (Flat score) = ${points} VP`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
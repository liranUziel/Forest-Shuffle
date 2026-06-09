// src/scoring/top_bottom/penny_bun.js
export const scorePennyBun = (cardInput, boardObject, currentTree, helpers, engine) => {
    const horseChestnutCount = (engine.getTreeSpeciesCounts(boardObject).horse_chestnut || 0);
    const points = horseChestnutCount * engine.topBottomCasesVp.penny_bun;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Penny Bun horse_chestnut(${horseChestnutCount}) x 4 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
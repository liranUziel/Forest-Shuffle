// src/scoring/top_bottom/wood_ant.js
export const scoreWoodAnt = (cardInput, boardObject, currentTree, helpers, engine) => {
    const totalBottomCards = ((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []).length;
    const points = totalBottomCards * engine.topBottomCasesVp.wood_ant;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Wood Ant bottom cards(${totalBottomCards}) x 2 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
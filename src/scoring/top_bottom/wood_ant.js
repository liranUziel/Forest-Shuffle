// src/scoring/top_bottom/wood_ant.js
export const scoreWoodAnt = (cardInput, boardObject, currentTree, helpers, engine) => {
    const bottomEntries = (boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [];
    const bottomCards = bottomEntries.filter(entry => entry?.card).map(entry => entry.card);
    const totalBottomCards = bottomCards.length;
    const points = totalBottomCards * engine.topBottomCasesVp.wood_ant;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Wood Ant bottom cards(${totalBottomCards}) x 2 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: bottomCards,
    };
};
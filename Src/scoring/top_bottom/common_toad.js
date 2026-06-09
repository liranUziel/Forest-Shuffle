// src/scoring/top_bottom/common_toad.js
export const scoreCommonToad = (cardInput, boardObject, currentTree, helpers, engine) => {
    const bottomCards = (currentTree && currentTree.bottom) || [];
    const bottomCommonToads = bottomCards.reduce((acc, card) => {
        const id = helpers.normalizeName(card && (card.cardId || card.name));
        return acc + (id === 'common_toad' ? 1 : 0);
    }, 0);
    const active = bottomCommonToads >= 2;
    return {
        points: active ? engine.topBottomCasesVp.common_toad : 0,
        calculated: true,
        detail: active
            ? `Top/Bottom case: Common Toad pair active (${bottomCommonToads} on this tree bottom) = 5`
            : `Top/Bottom case: Common Toad pair inactive (${bottomCommonToads}/2 on this tree bottom)`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
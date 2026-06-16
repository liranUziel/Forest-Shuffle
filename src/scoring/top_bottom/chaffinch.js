// src/scoring/cards/top_bottom/chaffinch.js
export const scoreChaffinch = (cardInput, boardObject, currentTree, helpers, engine) => {
    const speciesId = engine.getSpeciesIdFromCard(currentTree && currentTree.species);
    const active = speciesId === 'beech';
    return {
        points: active ? engine.topBottomCasesVp.chaffinch : 0,
        calculated: true,
        detail: active
            ? 'Top/Bottom case: Chaffinch on Beech = 5'
            : `Top/Bottom case: Chaffinch inactive (${speciesId || 'no tree'})`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: active ? [currentTree.species] : [],
    };
};
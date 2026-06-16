// src/scoring/cards/top_bottom/red_squirrel.js
export const scoreRedSquirrel = (cardInput, boardObject, currentTree, helpers, engine) => {
    const speciesId = engine.getSpeciesIdFromCard(currentTree && currentTree.species);
    const active = speciesId === 'oak';
    return {
        points: active ? engine.topBottomCasesVp.red_squirrel : 0,
        calculated: true,
        detail: active
            ? 'Top/Bottom case: Red Squirrel on Oak = 5'
            : `Top/Bottom case: Red Squirrel inactive (${speciesId || 'no tree'} not oak)`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: active ? [currentTree.species] : [],
    };
};
// src/scoring/cards/sides/beech_marten.js

export const scoreBeechMarten = (cardInput, boardObject, currentTree, helpers, engine) => {
    const fullTreeCount = engine.getFullyOccupiedTreeCount(boardObject);
    return {
        points: fullTreeCount * 5,
        calculated: true,
        detail: `Side case: Beech Marten full_trees(${fullTreeCount}) x 5 = ${fullTreeCount * 5}`,
        ruleType: 'SIDE_CASE'
    };
};
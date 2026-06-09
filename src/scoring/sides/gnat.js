// src/scoring/cards/sides/gnat.js

export const scoreGnat = (cardInput, boardObject, currentTree, helpers, engine) => {
    const batCount = engine.getBatCardCount(boardObject);
    return {
        points: batCount,
        calculated: true,
        detail: `Side case: Gnat bats(${batCount}) x 1 = ${batCount}`,
        ruleType: 'SIDE_CASE'
    };
};
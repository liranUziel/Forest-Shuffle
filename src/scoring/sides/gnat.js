// src/scoring/cards/sides/gnat.js

export const scoreGnat = (cardInput, boardObject, currentTree, helpers, engine) => {
    const { totalBatCards: batCount, cards } = engine.getBatScoringStats(boardObject);
    return {
        points: batCount,
        calculated: true,
        detail: `Side case: Gnat bats(${batCount}) x 1 = ${batCount}`,
        ruleType: 'SIDE_CASE',
        contributors: cards,
    };
};
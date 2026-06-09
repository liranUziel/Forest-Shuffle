// src/scoring/cards/sides/bat.js

export const scoreBat = (cardInput, boardObject, currentTree, helpers, engine) => {
    const batStats = engine.getBatScoringStats(boardObject);
    const points = batStats.active ? 5 : 0;
    
    return {
        points,
        calculated: true,
        detail: batStats.active
            ? `Side case: Bat active (distinct_bats=${batStats.distinctBatTypes}) = 5`
            : `Side case: Bat inactive (distinct_bats=${batStats.distinctBatTypes}, need 3)`,
        ruleType: 'SIDE_CASE'
    };
};
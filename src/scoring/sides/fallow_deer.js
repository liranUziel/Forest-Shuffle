// src/scoring/cards/sides/fallow_deer.js

export const scoreFallowDeer = (cardInput, boardObject, currentTree, helpers, engine) => {
    const { count: clovenHoofedCount, cards } = engine.getClovenHoofedAnimalCount(boardObject);
    const points = clovenHoofedCount * 3;

    return {
        points,
        calculated: true,
        detail: `Side case: Fallow Deer cloven_hoofed(${clovenHoofedCount}) x 3 = ${points}`,
        ruleType: 'SIDE_CASE',
        contributors: cards,
    };
};
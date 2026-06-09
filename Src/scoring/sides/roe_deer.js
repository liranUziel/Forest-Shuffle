// src/scoring/cards/sides/roe_deer.js

export const scoreRoeDeer = (cardInput, boardObject, currentTree, helpers, engine) => {
    const colors = (cardInput && cardInput.colors) || [];
    const isBlueRoeDeer = colors.some((color) => helpers.normalizeName(color) === 'blue');
    const isYellowRoeDeer = colors.some((color) => helpers.normalizeName(color) === 'yellow');
    const isGreenRoeDeer = colors.some((color) => helpers.normalizeName(color) === 'green');
    const isLimeRoeDeer = colors.some((color) => helpers.normalizeName(color) === 'lime');

    if (isBlueRoeDeer) {
        const blueTypeCount = engine.getColorTypeCardCount(boardObject, 'blue', 'silver_fir');
        return {
            points: blueTypeCount * 3,
            calculated: true,
            detail: `Side case: Roe Deer (Blue) blue_cards+silver_fir(${blueTypeCount}) x 3 = ${blueTypeCount * 3}`,
            ruleType: 'SIDE_CASE'
        };
    }

    if (isYellowRoeDeer) {
        const yellowTypeCount = engine.getColorTypeCardCount(boardObject, 'yellow', 'linden');
        return {
            points: yellowTypeCount * 3,
            calculated: true,
            detail: `Side case: Roe Deer (Yellow) yellow_cards+linden(${yellowTypeCount}) x 3 = ${yellowTypeCount * 3}`,
            ruleType: 'SIDE_CASE'
        };
    }

    if (isGreenRoeDeer) {
        const greenTypeCount = engine.getColorTypeCardCount(boardObject, 'green', 'beech');
        return {
            points: greenTypeCount * 3,
            calculated: true,
            detail: `Side case: Roe Deer (Green) green_cards+beech(${greenTypeCount}) x 3 = ${greenTypeCount * 3}`,
            ruleType: 'SIDE_CASE'
        };
    }

    if (isLimeRoeDeer) {
        const limeTypeCount = engine.getColorTypeCardCount(boardObject, 'lime', null);
        return {
            points: limeTypeCount * 3,
            calculated: true,
            detail: `Side case: Roe Deer (Lime) lime_cards(${limeTypeCount}) x 3 = ${limeTypeCount * 3}`,
            ruleType: 'SIDE_CASE'
        };
    }

    return {
        points: 0,
        calculated: true,
        detail: 'Side case: Roe Deer inactive (no blue/yellow/green/lime variant detected)',
        ruleType: 'SIDE_CASE'
    };
};
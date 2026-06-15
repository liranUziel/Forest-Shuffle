export const scoreRoeDeer = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Dynamically grab whatever color this specific deer has
    const colors = (cardInput && cardInput.colors) || [];
    
    if (colors.length === 0) {
        return {
            points: 0,
            calculated: true,
            detail: 'Side case: Roe Deer inactive (no color assigned to card)',
            ruleType: 'SIDE_CASE'
        };
    }

    // The deer's target color
    const targetColor = helpers.normalizeName(colors[0]);

    // Use engine dynamically to find the matching type
    const matchCount = engine.getColorTypeCardCount(boardObject, targetColor, null);
    
    return {
        points: matchCount * 3,
        calculated: true,
        detail: `Side case: Roe Deer (${targetColor}) (${matchCount}) x 3 = ${matchCount * 3}`,
        ruleType: 'SIDE_CASE'
    };
};
// src/scoring/cards/top_bottom/great_spotted_woodpecker.js
export const scoreGreatSpottedWoodpecker = (cardInput, boardObject, currentTree, helpers, engine) => {
    const hasMost = !!(cardInput && cardInput.hasMost);
    return {
        points: hasMost ? 10 : 0,
        calculated: true,
        detail: hasMost
            ? 'Top/Bottom case: Great Spotted Woodpecker (Most) = 10'
            : 'Top/Bottom case: Great Spotted Woodpecker inactive (Most unchecked)',
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
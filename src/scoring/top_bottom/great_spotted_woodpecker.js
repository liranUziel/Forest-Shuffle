// src/scoring/top_bottom/great_spotted_woodpecker.js
export const scoreGreatSpottedWoodpecker = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Check the boolean flag injected by the UI checkbox
    const hasMost = cardInput.hasMost === true;
    const points = hasMost ? 10 : 0;

    return {
        points: points,
        calculated: true,
        detail: `Top/Bottom case: Woodpecker (Most Trees: ${hasMost ? 'Yes' : 'No'}) = ${points} VP`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
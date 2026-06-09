// src/scoring/cards/sides/red_deer.js

export const scoreRedDeer = (cardInput, boardObject, currentTree, helpers, engine) => {
    const plantCount = engine.getRedDeerPlantCount(boardObject);
    const treeCount = engine.getPlantedTreeCount(boardObject);
    const points = plantCount + treeCount;

    return {
        points,
        calculated: true,
        detail: `Side case: Red Deer plants(${plantCount}) + trees(${treeCount}) = ${points}`,
        ruleType: 'SIDE_CASE'
    };
};
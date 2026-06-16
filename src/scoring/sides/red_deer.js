// src/scoring/cards/sides/red_deer.js

export const scoreRedDeer = (cardInput, boardObject, currentTree, helpers, engine) => {
    const { count: plantCount, cards: plantCards } = engine.getRedDeerPlantCount(boardObject);
    const { count: treeCount, cards: treeCards } = engine.getPlantedTreeCount(boardObject);
    const points = plantCount + treeCount;

    return {
        points,
        calculated: true,
        detail: `Side case: Red Deer plants(${plantCount}) + trees(${treeCount}) = ${points}`,
        ruleType: 'SIDE_CASE',
        contributors: [...plantCards, ...treeCards],
    };
};
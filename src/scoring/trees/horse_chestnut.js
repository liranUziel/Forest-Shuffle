// src/scoring/trees/horse_chestnut.js
export const scoreHorseChestnut = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Get total count of Horse Chestnuts in the forest
    const horseChestnuts = engine.getTreesOfSpecies(boardObject, 'horse_chestnut');
    const count = horseChestnuts.length;

    // Calculate the exponential score using your engine helper
    const points = engine.getHorseChestnutGroupScore(count);

    // Ensure we only score this massive set once
    const leaderTreeId = engine.getHorseChestnutLeaderTreeId(boardObject);
    const isLeader = !!(currentTree && currentTree.id === leaderTreeId);

    if (isLeader) {
        return {
            points: points,
            calculated: true,
            detail: `Tree: Horse Chestnut Set (${count} trees) = ${points} VP`,
            ruleType: 'TREE',
            contributors: horseChestnuts,
        };
    }

    // Duplicates return 0 so the math stays clean
    return {
        points: 0,
        calculated: true,
        detail: `Tree: Horse Chestnut (Score handled by leader)`,
        ruleType: 'TREE'
    };
};
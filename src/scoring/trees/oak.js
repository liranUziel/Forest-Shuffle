// src/scoring/trees/oak.js
export const scoreOak = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Grab the list of unique tree species currently planted
    const uniqueTreeIds = engine.getUniquePlantedTreeTypeIds(boardObject);

    // The 8 core species required (Saplings are implicitly excluded)
    const coreSpecies = [
        'beech', 'birch', 'douglas_fir', 'horse_chestnut', 
        'linden', 'oak', 'silver_fir', 'sycamore'
    ];

    // Count how many of the core species are present in the unique list
    const presentCoreSpeciesCount = coreSpecies.filter(species => uniqueTreeIds.includes(species)).length;
    const hasAll8 = presentCoreSpeciesCount === 8;

    const points = hasAll8 ? 10 : 0;

    return {
        points: points,
        calculated: true,
        detail: `Tree: Oak (Unique core trees: ${presentCoreSpeciesCount}/8) = ${points} VP`,
        ruleType: 'TREE'
    };
};
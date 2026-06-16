// src/scoring/trees/oak.js
export const scoreOak = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Grab one representative card per unique tree species currently planted
    const uniqueTreeCards = engine.getUniquePlantedTreeTypeCards(boardObject);

    // The 8 core species required (Saplings are implicitly excluded)
    const coreSpecies = [
        'beech', 'birch', 'douglas_fir', 'horse_chestnut',
        'linden', 'oak', 'silver_fir', 'sycamore'
    ];

    // Keep only the core-species cards present
    const presentCoreSpeciesCards = uniqueTreeCards.filter(card => coreSpecies.includes(engine.getSpeciesIdFromCard(card)));
    const presentCoreSpeciesCount = presentCoreSpeciesCards.length;
    const hasAll8 = presentCoreSpeciesCount === 8;

    const points = hasAll8 ? 10 : 0;

    return {
        points: points,
        calculated: true,
        detail: `Tree: Oak (Unique core trees: ${presentCoreSpeciesCount}/8) = ${points} VP`,
        ruleType: 'TREE',
        contributors: hasAll8 ? presentCoreSpeciesCards : [],
    };
};
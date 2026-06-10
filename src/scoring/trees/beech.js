// src/scoring/trees/beech.js

export function scoreBeech(treeNode, allTreesInForest) {
    let score = 0;
    
    // Count how many Beech trees the player has in total
    const totalBeeches = allTreesInForest.filter(tree => tree.name === "Beech").length;

    // Forest Shuffle Rule: Beeches only score if you have 4 or more!
    if (totalBeeches >= 4) {
        score += 5; 
    }

    // Add any logic here for Violet Carpenter Bees if you are adding them later!
    
    return score;
}
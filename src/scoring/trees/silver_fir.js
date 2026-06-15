// src/scoring/trees/silver_fir.js
export const scoreSilverFir = (cardInput, boardObject, currentTree, helpers, engine) => {
    let attachedCount = 0;
    
    // Safely count all cards currently tucked under this specific tree
    ['top', 'bottom', 'left', 'right'].forEach(slot => {
        if (currentTree[slot] && Array.isArray(currentTree[slot])) {
            attachedCount += currentTree[slot].length;
        }
    });

    const points = attachedCount * 2;

    return {
        points: points,
        calculated: true,
        detail: `Tree: Silver Fir (${attachedCount} attached cards x 2) = ${points} VP`,
        ruleType: 'TREE'
    };
};
// src/scoring/trees/silver_fir.js
export const scoreSilverFir = (cardInput, boardObject, currentTree, helpers, engine) => {
    const attachedCards = [];

    // Safely collect all cards currently tucked under this specific tree
    ['top', 'bottom', 'left', 'right'].forEach(slot => {
        if (currentTree[slot] && Array.isArray(currentTree[slot])) {
            attachedCards.push(...currentTree[slot]);
        }
    });

    const attachedCount = attachedCards.length;
    const points = attachedCount * 2;

    return {
        points: points,
        calculated: true,
        detail: `Tree: Silver Fir (${attachedCount} attached cards x 2) = ${points} VP`,
        ruleType: 'TREE',
        contributors: attachedCards,
    };
};
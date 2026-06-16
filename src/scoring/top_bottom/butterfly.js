// src/scoring/top_bottom/butterfly.js
export const scoreButterfly = (cardInput, boardObject, currentTree, helpers, engine) => {
    const mapping = engine.getButterflySetMapping(boardObject);
    const cardToSetMap = mapping.cardToSetMap;
    const setSizes = mapping.setSizes;
    const setInfo = cardToSetMap.get(cardInput);

    if (!setInfo) {
        return { points: 0, calculated: true, detail: 'Butterfly not active', ruleType: 'TOP_BOTTOM_CASE' };
    }

    const setScale = { 0: 0, 1: 0, 2: 3, 3: 6, 4: 12, 5: 20 };
    const setSize = setSizes[setInfo.setIndex];
    const setCards = mapping.setCards[setInfo.setIndex];

    const points = setInfo.isLeader ? (setScale[setSize] || 0) : 0;

    return {
        points: points,
        calculated: true,
        detail: setInfo.isLeader
            ? `Butterfly Set ${setInfo.setIndex + 1} Leader (${setSize} unique) = ${points} VP`
            : `Butterfly Set ${setInfo.setIndex + 1} Member (Score handled by Leader)`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: setCards,
    };
};
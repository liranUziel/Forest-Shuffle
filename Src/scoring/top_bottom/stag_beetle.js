// src/scoring/top_bottom/stag_beetle.js
export const scoreStagBeetle = (cardInput, boardObject, currentTree, helpers, engine) => {
    const attachedEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const stagBeetlePawedAnimalIds = engine.getStagBeetlePawedAnimalIds();
    let stagBeetlePawedAnimalCount = 0;
    attachedEntries.forEach((entry) => {
        if (!entry || !entry.card) return;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        if (stagBeetlePawedAnimalIds.has(entryId)) stagBeetlePawedAnimalCount += 1;
    });

    const points = stagBeetlePawedAnimalCount * engine.topBottomCasesVp.stag_beetle;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Stag Beetle pawed animals(${stagBeetlePawedAnimalCount}) x 1 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
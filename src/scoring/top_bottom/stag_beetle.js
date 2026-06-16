// src/scoring/top_bottom/stag_beetle.js
export const scoreStagBeetle = (cardInput, boardObject, currentTree, helpers, engine) => {
    const attachedEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const stagBeetlePawedAnimalIds = engine.getStagBeetlePawedAnimalIds();
    const pawedAnimals = attachedEntries.filter(entry =>
        entry?.card && stagBeetlePawedAnimalIds.has(helpers.normalizeName(entry.card.cardId || entry.card.name))
    ).map(entry => entry.card);
    const stagBeetlePawedAnimalCount = pawedAnimals.length;

    const points = stagBeetlePawedAnimalCount * engine.topBottomCasesVp.stag_beetle;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Stag Beetle pawed animals(${stagBeetlePawedAnimalCount}) x 1 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: pawedAnimals,
    };
};
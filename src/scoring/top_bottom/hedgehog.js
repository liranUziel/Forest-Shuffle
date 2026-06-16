// src/scoring/top_bottom/hedgehog.js
export const scoreHedgehog = (cardInput, boardObject, currentTree, helpers, engine) => {
    const attachedEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const hedgehogButterflyIds = new Set([
        'silver_washed_fritillary',
        'large_tortoiseshell',
        'camberwell_beauty',
        'peacock_butterfly',
        'purple_emperor'
    ]);
    const butterflies = attachedEntries.filter(entry =>
        entry?.card && hedgehogButterflyIds.has(helpers.normalizeName(entry.card.cardId || entry.card.name))
    ).map(entry => entry.card);
    const hedgehogButterflyCount = butterflies.length;

    const points = hedgehogButterflyCount * engine.topBottomCasesVp.hedgehog;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Hedgehog butterflies(${hedgehogButterflyCount}) x 2 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: butterflies,
    };
};
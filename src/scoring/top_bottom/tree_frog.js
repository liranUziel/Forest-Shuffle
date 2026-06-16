// src/scoring/top_bottom/tree_frog.js
export const scoreTreeFrog = (cardInput, boardObject, currentTree, helpers, engine) => {
    const attachedEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
    ];
    const gnats = attachedEntries.filter(entry =>
        entry?.card && helpers.normalizeName(entry.card.cardId || entry.card.name) === 'gnat'
    ).map(entry => entry.card);
    const gnatCount = gnats.length;

    const points = gnatCount * engine.topBottomCasesVp.tree_frog;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Tree Frog gnat(${gnatCount}) x 5 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: gnats,
    };
};
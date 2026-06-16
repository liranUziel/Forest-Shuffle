// src/scoring/top_bottom/tree_ferns.js
export const scoreTreeFerns = (cardInput, boardObject, currentTree, helpers, engine) => {
    const reptileIds = new Set(['fire_salamander', 'pond_turtle', 'tree_frog', 'common_toad']);
    const topBottomEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
    ];
    const reptiles = topBottomEntries.filter(entry =>
        entry?.card && reptileIds.has(helpers.normalizeName(entry.card.cardId || entry.card.name))
    ).map(entry => entry.card);
    const reptileCount = reptiles.length;

    const points = reptileCount * engine.topBottomCasesVp.tree_ferns;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Tree Ferns reptiles(${reptileCount}) x 6 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE',
        contributors: reptiles,
    };
};
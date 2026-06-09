// src/scoring/top_bottom/tree_ferns.js
export const scoreTreeFerns = (cardInput, boardObject, currentTree, helpers, engine) => {
    const reptileIds = new Set(['fire_salamander', 'pond_turtle', 'tree_frog', 'common_toad']);
    const topBottomEntries = [
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
    ];
    let reptileCount = 0;
    topBottomEntries.forEach((entry) => {
        if (!entry || !entry.card) return;
        const entryId = helpers.normalizeName(entry.card.cardId || entry.card.name);
        if (reptileIds.has(entryId)) reptileCount += 1;
    });

    const points = reptileCount * engine.topBottomCasesVp.tree_ferns;
    return {
        points,
        calculated: true,
        detail: `Top/Bottom case: Tree Ferns reptiles(${reptileCount}) x 6 = ${points}`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
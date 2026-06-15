export const scoreFirefly = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Count all firefly cards directly from the top/bottom slots.
    const entries = [...(boardObject?.bySlot?.top ?? []), ...(boardObject?.bySlot?.bottom ?? [])];
    const fireflyCount = entries.filter(e =>
        e?.card && helpers.normalizeName(e.card.cardId || e.card.name) === 'firefly'
    ).length;

    // Set scoring: 1→0 VP, 2→10 VP, 3→15 VP, 4+→20 VP. Only the leader claims the total.
    const setScore = engine.getFireflySetScore(fireflyCount);
    const leaderTreeId = engine.getFireflyTopBottomLeaderTreeId(boardObject);
    const isLeader = !!(currentTree?.id && currentTree.id === leaderTreeId);

    return {
        points: isLeader ? setScore : 0,
        calculated: true,
        detail: isLeader
            ? `Top/Bottom: Firefly set (${fireflyCount}) = ${setScore} VP (leader)`
            : `Top/Bottom: Firefly (${fireflyCount} on board → ${setScore} total, handled by leader)`,
        ruleType: 'TOP_BOTTOM_CASE',
    };
};

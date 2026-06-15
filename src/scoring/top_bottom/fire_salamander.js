export const scoreFireSalamander = (cardInput, boardObject, currentTree, helpers, engine) => {
    // Count all fire salamander cards directly from the top/bottom slots.
    const entries = [...(boardObject?.bySlot?.top ?? []), ...(boardObject?.bySlot?.bottom ?? [])];
    const fireCount = entries.filter(e =>
        e?.card && helpers.normalizeName(e.card.cardId || e.card.name) === 'fire_salamander'
    ).length;

    // Set scoring: 1→5 VP, 2→15 VP, 3+→25 VP. Only the leader (first on board) claims the total.
    const setScore = fireCount >= 3 ? 25 : fireCount === 2 ? 15 : fireCount === 1 ? 5 : 0;
    const leaderTreeId = engine.getFireSalamanderLeaderTreeId(boardObject);
    const isLeader = !!(currentTree?.id && currentTree.id === leaderTreeId);

    return {
        points: isLeader ? setScore : 0,
        calculated: true,
        detail: isLeader
            ? `Top/Bottom: Fire Salamander set (${fireCount}) = ${setScore} VP (leader)`
            : `Top/Bottom: Fire Salamander (${fireCount} on board → ${setScore} total, handled by leader)`,
        ruleType: 'TOP_BOTTOM_CASE',
    };
};

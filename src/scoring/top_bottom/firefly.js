// src/scoring/top_bottom/firefly.js
export const scoreFirefly = (cardInput, boardObject, currentTree, helpers, engine) => {
    const counts = engine.evaluate_top_bottom(boardObject).counts;
    const fireflyCount = counts.firefly || 0;
    const setScore = engine.getFireflySetScore(fireflyCount);
    const leaderTreeId = engine.getFireflyTopBottomLeaderTreeId(boardObject);
    const isLeader = !!(currentTree && currentTree.id && currentTree.id === leaderTreeId);

    if (isLeader) {
        return {
            points: setScore,
            calculated: true,
            detail: `Top/Bottom case: Fireflies set ${fireflyCount} -> ${setScore} (counted once)`,
            ruleType: 'TOP_BOTTOM_CASE'
        };
    }

    return {
        points: 0,
        calculated: true,
        detail: `Top/Bottom case: Fireflies set handled by one card (${fireflyCount} -> ${setScore})`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
// src/scoring/top_bottom/butterfly.js
export const scoreButterfly = (cardInput, boardObject, currentTree, helpers, engine) => {
    const counts = engine.evaluate_top_bottom(boardObject).counts;
    const butterflyCount = counts.butterfly || 0;
    const setScore = engine.getButterflySetScore(butterflyCount);
    const leaderTreeId = engine.getButterflyLeaderTreeId(boardObject);
    const isLeader = !!(currentTree && currentTree.id && currentTree.id === leaderTreeId);

    if (isLeader) {
        return {
            points: setScore,
            calculated: true,
            detail: `Top/Bottom case: Butterfly set ${butterflyCount} -> ${setScore} (counted once)`,
            ruleType: 'TOP_BOTTOM_CASE'
        };
    }

    return {
        points: 0,
        calculated: true,
        detail: `Top/Bottom case: Butterfly set handled by one card (${butterflyCount} -> ${setScore})`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
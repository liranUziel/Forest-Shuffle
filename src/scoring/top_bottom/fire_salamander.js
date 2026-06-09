// src/scoring/top_bottom/fire_salamander.js
export const scoreFireSalamander = (cardInput, boardObject, currentTree, helpers, engine) => {
    const counts = engine.evaluate_top_bottom(boardObject).counts;
    const fireCount = counts.fire_salamander || 0;
    const setScore = fireCount >= 3 ? 25 : (fireCount === 2 ? 15 : (fireCount === 1 ? 5 : 0));
    const leaderTreeId = engine.getFireSalamanderLeaderTreeId(boardObject);
    const isLeader = !!(currentTree && currentTree.id && currentTree.id === leaderTreeId);

    if (isLeader) {
        return {
            points: setScore,
            calculated: true,
            detail: `Top/Bottom case: Fire Salamander set ${fireCount} -> ${setScore} (counted once)`,
            ruleType: 'TOP_BOTTOM_CASE'
        };
    }

    return {
        points: 0,
        calculated: true,
        detail: `Top/Bottom case: Fire Salamander set handled by one card (${fireCount} -> ${setScore})`,
        ruleType: 'TOP_BOTTOM_CASE'
    };
};
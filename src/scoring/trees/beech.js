export const scoreBeech = (cardInput, boardObject, currentTree, helpers, engine) => {
    const beechCount = (boardObject?.bySlot?.species ?? []).filter(e =>
        e?.card && helpers.normalizeName(e.card.cardId || e.card.name) === 'beech'
    ).length;
    const points = beechCount >= 4 ? 5 : 0;
    return { points, calculated: true, detail: `Tree: Beech (${beechCount} total, need ≥4) = ${points} VP`, ruleType: 'TREE' };
};

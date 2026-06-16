export const scoreBeech = (cardInput, boardObject, currentTree, helpers, engine) => {
    const beeches = (boardObject?.bySlot?.species ?? []).filter(e =>
        e?.card && helpers.normalizeName(e.card.cardId || e.card.name) === 'beech'
    ).map(e => e.card);
    const beechCount = beeches.length;
    const points = beechCount >= 4 ? 5 : 0;
    return {
        points, calculated: true,
        detail: `Tree: Beech (${beechCount} total, need ≥4) = ${points} VP`,
        ruleType: 'TREE',
        contributors: points > 0 ? beeches : [],
    };
};

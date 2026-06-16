// src/scoring/sides/european_fat_dormouse.js
export const scoreEuropeanFatDormouse = (cardInput, boardObject, currentTree, helpers, engine) => {
    const batIds = engine.getBatCardIds();
    const sideCards = [...(currentTree?.left ?? []), ...(currentTree?.right ?? [])];
    const bats = sideCards.filter(card => batIds.has(helpers.normalizeName(card?.cardId || card?.name)));
    const active = bats.length > 0;

    return {
        points: active ? 15 : 0,
        calculated: true,
        detail: active
            ? 'Side case: European Fat Dormouse with Bat on same tree = 15'
            : 'Side case: European Fat Dormouse inactive (no Bat on this tree)',
        ruleType: 'SIDE_CASE',
        contributors: bats,
    };
};

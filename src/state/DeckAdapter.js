/**
 * DeckAdapter.js — converts base_forest_shffle_deck.json entries into the
 * { filename, split_type, content } shape CardModal/UIManager consume.
 *
 * Source entries store one combined "name1-name2" string per card; the two
 * species names are recovered by splitting on the first dash (every non-tree
 * entry has exactly one).
 */

const LAYOUT_TO_SPLIT_TYPE = { Horizontal: 'left_right', Vertical: 'top_bottom', Tree: 'trees' };
const SIDE_KEYS = { left_right: ['left', 'right'], top_bottom: ['top', 'bottom'], trees: ['tree'] };
const SYMBOL_FIELDS = ['part_1_Symbols', 'part_2_Symbols'];

/**
 * Tree species have no Colors entry in the source data (the physical cards
 * are uncoloured) but each species is still associated with one of the 8
 * game colors for filtering/swatch display — mirrors the species border
 * color mapping the UI already used.
 */
const TREE_SPECIES_COLORS = {
    beech: 'green', birch: 'lime', oak: 'brown', linden: 'yellow',
    douglas_fir: 'silver', horse_chestnut: 'orange', silver_fir: 'blue', sycamore: 'red',
};

function toTitleCase(snakeCaseName) {
    return snakeCaseName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function splitCombinedName(name, layout) {
    if (layout === 'Tree') return [name];
    const dashIndex = name.indexOf('-');
    return [name.slice(0, dashIndex), name.slice(dashIndex + 1)];
}

/** @param {Array<object>} rawEntries — base_forest_shffle_deck.json's `deck` array */
export function adaptDeck(rawEntries) {
    return rawEntries.map(entry => {
        const split_type = LAYOUT_TO_SPLIT_TYPE[entry.Layout];
        const sideKeys    = SIDE_KEYS[split_type];
        const sideNames   = splitCombinedName(entry.Name, entry.Layout);

        const content = {};
        sideKeys.forEach((key, i) => {
            const rawColor = entry.Colors[i];
            const colors = rawColor
                ? [rawColor.toLowerCase()]
                : (split_type === 'trees' ? [TREE_SPECIES_COLORS[sideNames[i]]].filter(Boolean) : []);

            content[key] = {
                name: toTitleCase(sideNames[i]),
                colors,
                symbols: entry[SYMBOL_FIELDS[i]] ?? [],
            };
        });

        return { filename: `${entry.name}.png`, split_type, content };
    });
}

/**
 * debugTools.js — Shift+D fills the board with a scenario built to exercise
 * EVERY registered card scorer at least once, so scoring regressions show up
 * immediately in the console breakdown.
 *
 * Per-card test shape depends on how that card's formula reads the board:
 *   - Per-tree condition/count (Chaffinch-on-Beech, Common Toad pair, Silver
 *     Fir attached count, Linden/Woodpecker UI flags) → two instances, one
 *     in the "off"/low state and one in the "on"/high state.
 *   - True multi-set mechanic (Butterfly, via per-species bin-packing) → two
 *     concurrent sets: one partial (>0) and one complete (max).
 *   - Single board-wide running tally with one leader (Firefly, Fire
 *     Salamander, Horse Chestnut) → only ONE state is representable in a
 *     static snapshot, so these are pushed to their capped/max value.
 *   - Flat/fixed-value cards (Squeeker, Badger, Pond Turtle, Birch, ...) →
 *     one instance; there is no "zero" variant to show.
 *   - Cards with no individual scoring ability (Raccoon, Brown Bear,
 *     European Fat Dormouse, Violet Carpenter Bee, Parasol Mushroom, Mole)
 *     → one instance, expected to report 0 VP by design.
 *
 * Filenames/colors/symbols are pulled from Assetes/Data/base_forest_shffle_deck.json
 * (folders: Assetes/Images/Cards/{left_right,top_bottom,tree}/).
 */

const T  = (cardId, name, extra = {}) =>
    ({ cardId, name, folder: 'tree', filename: `${cardId}.png`, colors: [], symbols: [], ...extra });

const S  = (cardId, name, filename, colors = [], symbols = []) =>
    ({ cardId, name, folder: 'left_right', filename, colors, symbols });

const TB = (cardId, name, filename, colors = [], symbols = []) =>
    ({ cardId, name, folder: 'top_bottom', filename, colors, symbols });

// ── Tree species ─────────────────────────────────────────────────────────

const BEECH_1 = T('beech', 'Beech');
const BEECH_2 = T('beech', 'Beech');           // fully-occupied host → Beech Marten test
const BEECH_3 = T('beech', 'Beech');
const BEECH_4 = T('beech', 'Beech');           // 4th Beech → beech>=4 threshold active (5VP each)
const BIRCH_1 = T('birch', 'Birch');
const BIRCH_2 = T('birch', 'Birch');
const BIRCH_3 = T('birch', 'Birch');           // extra host
const BIRCH_4 = T('birch', 'Birch');           // extra host
const BIRCH_5 = T('birch', 'Birch');           // extra host
const BIRCH_6 = T('birch', 'Birch');           // extra host — birchCount=6 → Fly Agaric x3 = 18VP
const OAK_1   = T('oak', 'Oak');
const LINDEN_LOW  = T('linden', 'Linden');                                  // hasLindenMost=false → 1VP
const LINDEN_HIGH = T('linden', 'Linden', { hasLindenMost: true });         // hasLindenMost=true  → 3VP
const DOUGLAS_FIR = T('douglas_fir', 'Douglas Fir');
const SILVER_FIR_1 = T('silver_fir', 'Silver Fir');   // 1 attached card  → 2VP ("x1")
const SILVER_FIR_2 = T('silver_fir', 'Silver Fir');   // 2 attached cards → 4VP ("x2")
const SYCAMORE   = T('sycamore', 'Sycamore');
const SYCAMORE_2 = T('sycamore', 'Sycamore');  // extra host
const HC = Array.from({ length: 7 }, () => T('horse_chestnut', 'Horse Chestnut')); // 7 → leader = 49VP (cap)

// ── Side cards (left/right) ─────────────────────────────────────────────

const SQUEEKER  = S('squeeker', 'Squeeker', 'roe_deer-squeaker.png', ['red']);
const BADGER    = S('badger', 'European Badger', 'european_badger-gnat.png', ['orange']);
const HARE_A    = S('european_hare', 'European Hare', 'european_hare-european_badger.png', ['yellow']);
const HARE_B    = S('european_hare', 'European Hare', 'raccoon-european_hare.png', ['red']); // hareCount=2
const RED_FOX   = S('red_fox', 'Red Fox', 'lynx-red_fox.png', ['silver']);          // = hareCount x2 = 4VP
const LYNX      = S('lynx', 'Lynx', 'violet_carpenter_bee-lynx.png', ['green']);    // roe_deer present → 10VP
const ROE_DEER_A = S('roe_deer', 'Roe Deer', 'raccoon-roe_deer.png', ['green']);
const ROE_DEER_B = S('roe_deer', 'Roe Deer', 'fallow_deer-roe_deer.png', ['yellow']);
const RED_DEER   = S('red_deer', 'Red Deer', 'red_deer-brown_bear.png', ['yellow']);
const FALLOW_DEER = S('fallow_deer', 'Fallow Deer', 'fallow_deer-wild_boar.png', ['yellow']);
const WOLF       = S('wolf', 'Wolf', 'wolf-greater_horse_shoe_bat.png', ['red']);
const WILD_BOAR  = S('wild_boar', 'Wild Boar', 'wild_boar-european_hare.png', ['red']); // squeeker present → 10VP
const BEECH_MARTEN = S('beech_marten', 'Beech Marten', 'european_hare-beech_marten.png', ['orange']);
const GNAT       = S('gnat', 'Gnat', 'wolf-gnat.png', ['orange']);                  // = batCount x1
const BAT_1 = S('bechstein_s_bat', "Bechstein'S Bat", 'bechsteins_bat-wolf.png', ['brown']);
const BAT_2 = S('brown_long_eared_bat', 'Brown Long-Eared Bat', 'european_fat_dormouse-brown_long_eared_bat.png', ['blue']);
const BAT_3 = S('greater_horse_shoe_bat', 'Greater Horse-Shoe Bat', 'wolf-greater_horse_shoe_bat.png', ['yellow']);
const BAT_4 = S('barbastelle_bat', 'Barbastelle Bat', 'barbastelle_bat-wild_boar.png', ['orange']);
const RACCOON   = S('raccoon', 'Raccoon', 'lynx-raccoon.png', ['lime']);                       // no own ability → 0VP
const BROWN_BEAR = S('brown_bear', 'Brown Bear', 'red_deer-brown_bear.png', ['green']);        // no own ability → 0VP
const EUR_FAT_DORMOUSE = S('european_fat_dormouse', 'European Fat Dormouse', 'european_fat_dormouse-barbastelle_bat.png', ['green']); // 0VP
const VIOLET_CARPENTER_BEE = S('violet_carpenter_bee', 'Violet Carpenter Bee', 'gnat-violet_carpenter_bee.png', ['silver']); // 0VP own score
const SF_FILLER_1 = S('squeeker', 'Squeeker', 'red_fox-squeaker.png', ['brown']);   // Silver Fir #1 filler
const SF_FILLER_2 = S('badger', 'European Badger', 'european_badger-fallow_deer.png', ['orange']); // Silver Fir #2 filler
const SF_FILLER_3 = S('gnat', 'Gnat', 'european_badger-gnat.png', ['brown']);       // Silver Fir #2 filler

// ── Top/Bottom cards ─────────────────────────────────────────────────────

const POND_TURTLE = TB('pond_turtle', 'Pond Turtle', 'camberwell_beauty-pond_turtle.png', ['lime']);
const TAWNY_OWL   = TB('tawny_owl', 'Tawny Owl', 'tawny_owl-common_toad.png', ['red']);
const EURASIAN_JAY = TB('eurasian_jay', 'Eurasian Jay', 'eurasian_jay-fly_agaric.png', ['red']);
const CHAFFINCH_ACTIVE   = TB('chaffinch', 'Chaffinch', 'chaffinch-common_toad.png', ['green']);   // on Beech → 5VP
const CHAFFINCH_INACTIVE = TB('chaffinch', 'Chaffinch', 'chaffinch-wood_ant.png', ['green']);      // on Douglas Fir → 0VP
const RED_SQUIRREL_ACTIVE   = TB('red_squirrel', 'Red Squirrel', 'red_squirrel-fireflies.png', ['orange']); // on Oak → 5VP
const RED_SQUIRREL_INACTIVE = TB('red_squirrel', 'Red Squirrel', 'red_squirrel-common_toad.png', ['silver']); // on Sycamore → 0VP
const GOSHAWK    = TB('goshawk', 'Goshawk', 'goshawk-wood_ant.png', ['blue']);
const WOOD_ANT   = TB('wood_ant', 'Wood Ant', 'chaffinch-wood_ant.png', ['red']);
const TREE_FROG  = TB('tree_frog', 'Tree Frog', 'bullfinch-tree_frog.png', ['yellow']);
const MOSS       = TB('moss', 'Moss', 'goshawk-moss.png', ['yellow']);
const WILD_STRAW = TB('wild_strawberries', 'Wild Strawberries', 'tawny_owl-wild_strawberries.png', ['red']);
const TREE_FERNS = TB('tree_ferns', 'Tree Ferns', 'bullfinch-tree_ferns.png', ['yellow']);
const BLACKBERRIES = TB('blackberries', 'Blackberries', 'large_tortoiseshell-blackberries.png', ['lime']);
const FLY_AGARIC = TB('fly_agaric', 'Fly Agaric', 'eurasian_jay-fly_agaric.png', ['blue']);
const HEDGEHOG   = TB('hedgehog', 'Hedgehog', 'bullfinch-hedgehog.png', ['green']);
const STAG_BEETLE = TB('stag_beetle', 'Stag Beetle', 'tawny_owl-stag_beetle.png', ['green']);
const PARASOL_MUSHROOM = TB('parasol_mushroom', 'Parasol Mushroom', 'bullfinch-parasol_mushroom.png', ['orange']); // 0VP by design
const MOLE       = TB('mole', 'Mole', 'large_tortoiseshell-mole_re-br.png', ['brown']);                            // 0VP by design
const COMMON_TOAD_1 = TB('common_toad', 'Common Toad', 'tawny_owl-common_toad.png', ['silver']); // stacked pair → 5VP each
const COMMON_TOAD_2 = TB('common_toad', 'Common Toad', 'goshawk-common_toad.png', ['red']);      // stacked pair → 5VP each
const COMMON_TOAD_ALONE = TB('common_toad', 'Common Toad', 'chaffinch-common_toad.png', ['blue']); // alone → 0VP
const PENNY_BUN  = TB('penny_bun', 'Penny Bun', 'great_spotted_woodpecker-penny_bun.png', ['silver']);
const GSW_LOW  = TB('great_spotted_woodpecker', 'Great Spotted Woodpecker', 'great_spotted_woodpecker-wood_ant.png', ['yellow']);
const GSW_HIGH = TB('great_spotted_woodpecker', 'Great Spotted Woodpecker', 'great_spotted_woodpecker-wild_strawberries.png', ['silver']);
GSW_HIGH.hasMost = true; // UI flag → 10VP (vs GSW_LOW's default false → 0VP)
const BULLFINCH = TB('bullfinch', 'Bullfinch', 'bullfinch-parasol_mushroom.png', ['silver']);
const FIRE_SALA_1 = TB('fire_salamander', 'Fire Salamander', 'red_squirrel-fire_salamander.png', ['yellow']);
const FIRE_SALA_2 = TB('fire_salamander', 'Fire Salamander', 'large_tortoiseshell-fire_salamander.png', ['silver']);
const FIRE_SALA_3 = TB('fire_salamander', 'Fire Salamander', 'silver_washed_fritillary-fire_salamander.png', ['orange']); // count=3 → leader 25VP (cap)
const FIREFLY_1 = TB('firefly', 'Fireflies', 'peacock_butterfly-fireflies.png', ['green']);
const FIREFLY_2 = TB('firefly', 'Fireflies', 'eurasian_jay-fireflies.png', ['silver']);
const FIREFLY_3 = TB('firefly', 'Fireflies', 'red_squirrel-fireflies.png', ['red']);
const FIREFLY_4 = TB('firefly', 'Fireflies', 'camberwell_beauty-fireflies.png', ['yellow']); // count=4 → leader 20VP (cap)
const CHANTERELLE = TB('chanterelle', 'Chanterelle', 'peacock_butterfly-chanterelle.png', ['blue']);

// Butterfly 2-set test: PE_A/CB_A form one set; PE_B..SF_B form a second set
// that (per the bin-packing order the engine uses) ends up complete (5/5)
// while the first stays partial (2/5) — see the HC[] tree order below.
const PE_A = TB('purple_emperor', 'Purple Emperor', 'purple_emperor-moss.png', ['orange']);
const CB_A = TB('camberwell_beauty', 'Camberwell Beauty', 'camberwell_beauty-tree_frog.png', ['lime']);
const PE_B = TB('purple_emperor', 'Purple Emperor', 'purple_emperor-pond_turtle.png', ['orange']);
const CB_B = TB('camberwell_beauty', 'Camberwell Beauty', 'camberwell_beauty-chanterelle.png', ['orange']);
const LT_B = TB('large_tortoiseshell', 'Large Tortoiseshell', 'large_tortoiseshell-mole_gr-re.png', ['green']);
const PB_B = TB('peacock_butterfly', 'Peacock Butterfly', 'peacock_butterfly-hedgehog.png', ['blue']);
const SF_B = TB('silver_washed_fritillary', 'Silver-Washed Fritillary', 'silver_washed_fritillary-moss.png', ['green']);

// ── Board layout ───────────────────────────────────────────────────────────
// HC[0..6]'s top slots carry the butterfly sequence in this exact order so
// the engine's bin-packing produces one partial set and one complete set.

const BOARD = [
    { species: BEECH_1,  top: CHAFFINCH_ACTIVE, bottom: STAG_BEETLE, left: HARE_A, right: BAT_1 },
    { species: BEECH_2,  top: TAWNY_OWL, bottom: PENNY_BUN, left: RED_DEER, right: FALLOW_DEER }, // fully occupied → Beech Marten test
    { species: BEECH_3,  top: EURASIAN_JAY, bottom: MOLE, left: WOLF, right: WILD_BOAR },
    { species: BEECH_4,  top: GOSHAWK, bottom: MOSS, left: LYNX, right: BEECH_MARTEN },
    { species: BIRCH_1,  top: BULLFINCH, bottom: WOOD_ANT, left: RED_FOX, right: HARE_B },
    { species: BIRCH_2,  bottom: TREE_FROG, left: RACCOON, right: BROWN_BEAR },
    { species: BIRCH_3,  bottom: POND_TURTLE },
    { species: BIRCH_4,  bottom: FLY_AGARIC },
    { species: BIRCH_5,  bottom: WILD_STRAW },
    { species: BIRCH_6,  bottom: FIREFLY_4 },
    { species: OAK_1,    top: RED_SQUIRREL_ACTIVE, bottom: CHANTERELLE, left: EUR_FAT_DORMOUSE, right: VIOLET_CARPENTER_BEE },
    { species: DOUGLAS_FIR, top: CHAFFINCH_INACTIVE, bottom: HEDGEHOG, left: BADGER, right: SQUEEKER },
    { species: SYCAMORE, top: RED_SQUIRREL_INACTIVE, bottom: COMMON_TOAD_ALONE, left: ROE_DEER_A, right: ROE_DEER_B },
    { species: SYCAMORE_2, bottom: PARASOL_MUSHROOM },
    { species: LINDEN_LOW,  top: GSW_LOW,  bottom: TREE_FERNS, left: GNAT, right: BAT_2 },
    { species: LINDEN_HIGH, top: GSW_HIGH, bottom: BLACKBERRIES, left: BAT_3, right: BAT_4 },
    { species: SILVER_FIR_1, left: SF_FILLER_1 },                       // 1 attached card → SilverFir x1 = 2VP
    { species: SILVER_FIR_2, left: SF_FILLER_2, right: SF_FILLER_3 },   // 2 attached cards → SilverFir x2 = 4VP
    { species: HC[0], top: PE_A,  bottom: FIRE_SALA_1 },
    { species: HC[1], top: CB_A,  bottom: FIRE_SALA_2 },
    { species: HC[2], top: PE_B,  bottom: FIRE_SALA_3 },
    { species: HC[3], top: CB_B,  bottom: [COMMON_TOAD_1, COMMON_TOAD_2] }, // stacked pair → 5VP each
    { species: HC[4], top: LT_B,  bottom: FIREFLY_1 },
    { species: HC[5], top: PB_B,  bottom: FIREFLY_2 },
    { species: HC[6], top: SF_B,  bottom: FIREFLY_3 },
];

export function runDebugScenario(state) {
    state.trees = [];

    BOARD.forEach(({ species, top, bottom, left, right }) => {
        state.addTree();
        const id = state.trees[state.trees.length - 1].id;

        state.addCardToSlot(id, 'species', species);

        if (top)    state.addCardToSlot(id, 'top', top);
        if (bottom) {
            if (Array.isArray(bottom)) {
                bottom.forEach((card, i) => state.addCardToSlot(id, 'bottom', card, i > 0));
            } else {
                state.addCardToSlot(id, 'bottom', bottom);
            }
        }
        if (left)  state.addCardToSlot(id, 'left',  left);
        if (right) state.addCardToSlot(id, 'right', right);
    });

    state.notify();

    const total     = state.calculateTotalScore();
    const breakdown = state.lastScoreBreakdown ?? [];

    console.group('🌲 Forest Shuffle — Debug Scenario Loaded');
    console.log(`Trees placed : ${state.trees.length}`);
    console.log(`Total score  : ${total} VP`);
    console.groupEnd();

    console.group('Score Breakdown');
    state.trees.forEach((tree, i) => {
        const items     = breakdown.filter(b => b.treeId === tree.id);
        const treeTotal = state.lastTreeScores?.[tree.id] ?? 0;
        console.group(`Tree ${i + 1} (${tree.species?.name ?? '?'}) — ${treeTotal} VP`);
        items.forEach(b => {
            const flag = b.calculated ? '✓' : '⚠';
            console.log(`  ${flag} [${b.slot}] ${b.cardName}: ${b.points} VP — ${b.detail}`);
        });
        console.groupEnd();
    });
    console.groupEnd();

    const missing = breakdown.filter(b => !b.calculated);
    if (missing.length) {
        console.warn(`⚠ ${missing.length} card(s) not scored:`);
        missing.forEach(b => console.warn(`  [${b.slot}] ${b.cardName}: ${b.detail}`));
    }
}

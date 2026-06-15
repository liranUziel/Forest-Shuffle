/**
 * debugTools.js — Shift+D fills the board with a curated scenario that
 * exercises every card scorer and prints a readable score breakdown to the
 * console.
 *
 * All filenames are real entries from master_deck.json.
 * Top/bottom cards only appear in top/bottom slots; side cards only in left/right slots.
 */

// ── Card builder helpers ───────────────────────────────────────────────────
// cardId must match the key used in ScoringEngine scorer maps.
// name   is the display name (used as fallback by scorers that read card.name).
// folder + filename must match the real path: Assetes/Cards/{folder}/{filename}

const T  = (cardId, name) =>
    ({ cardId, name, folder: 'Tree', filename: `${cardId}.png` });

// Side card (goes in left OR right slot — slot determined by BOARD entry)
const S  = (cardId, name, filename, colors = []) =>
    ({ cardId, name, folder: 'left_right', filename, colors });

// Top/bottom card (goes in top OR bottom slot — slot determined by BOARD entry)
const TB = (cardId, name, filename, colors = []) =>
    ({ cardId, name, folder: 'top_bottom', filename, colors });

// ── Tree species ───────────────────────────────────────────────────────────

const BEECH          = T('beech',          'Beech');
const BIRCH          = T('birch',          'Birch');
const OAK            = T('oak',            'Oak');
const LINDEN         = T('linden',         'Linden');
const DOUGLAS_FIR    = T('douglas_fir',    'Douglas Fir');
const SILVER_FIR     = T('silver_fir',     'Silver Fir');
const SYCAMORE       = T('sycamore',       'Sycamore');
const HORSE_CHESTNUT = T('horse_chestnut', 'Horse Chestnut');

// ── Side cards (left slot — animal is the LEFT half of the physical card) ──

const EUR_HARE_LIME  = S('european_hare',   'European Hare',    'european_hare_-_beech_marten.png',    ['lime']);
const EUR_HARE_YEL   = S('european_hare',   'European Hare',    'european_hare_-_european_badger.png', ['yellow']);
const EUR_HARE_BLUE  = S('european_hare',   'European Hare',    'european_hare_-_red_fox.png',         ['blue']);
const FALLOW_DEER    = S('fallow_deer',     'Fallow Deer',      'fallow_deer_-_roe_deer.png',          ['yellow']);
const WOLF_SLV       = S('wolf',            'Wolf',             'wolf-gnat.png',                       ['silver']);
const WOLF_RED       = S('wolf',            'Wolf',             'wolf-greater_horse shoe_bat.png',     ['red']);
const WILD_BOAR      = S('wild_boar',       'Wild Boar',        'wild_boar_-_beech_marten.png',        ['lime']);
const RED_FOX_L1     = S('red_fox',         'Red Fox',          'red_fox_-_wolf.png',                  ['yellow']);
const RED_FOX_L2     = S('red_fox',         'Red Fox',          'red_fox_-_squeaker.png',              ['green']);
const ROE_DEER_BLU   = S('roe_deer',        'Roe Deer',         'roe_deer_-_lynx.png',                 ['blue']);
const ROE_DEER_YEL   = S('roe_deer',        'Roe Deer',         'roe_deer_-_squeaker.png',             ['yellow']);
const RED_DEER_L1    = S('red_deer',        'Red Deer',         'red_deer_-_fallow_deer.png',          ['blue']);
const RED_DEER_L2    = S('red_deer',        'Red Deer',         'red_deer_-_brown_bear.png',           ['yellow']);
const GNAT_L         = S('gnat',            'Gnat',             'gnat_-_violet_carpenter_bee.png',     ['lime']);
const BEECH_MARTEN_L1= S('beech_marten',   'Beech Marten',     "beech_marten_-_bechstein's_bat.png",  ['green']);
const BEECH_MARTEN_L2= S('beech_marten',   'Beech Marten',     'beech_marten_-_brown_bear.png',       ['red']);
const EUR_BADGER_L   = S('european_badger', 'European Badger',  'european_badger_-_fallow_deer.png',   ['orange']);
const LYNX_L         = S('lynx',            'Lynx',             'lynx_-_european_hare.png',            ['silver']);

// ── Side cards (right slot — animal is the RIGHT half of the physical card) ─

const BECHSTEIN_BAT  = S('bechstein_s_bat',        "Bechstein'S Bat",      "beech_marten_-_bechstein's_bat.png",              ['lime']);
const BROWN_LONG_BAT = S('brown_long_eared_bat',   'Brown Long-Eared Bat', 'european_fat_dormouse-brown_long eared_bat.png',  ['green']);
const GR_HORSE_BAT   = S('greater_horse_shoe_bat', 'Greater Horse-Shoe Bat','wolf-greater_horse shoe_bat.png',               ['yellow']);
const ROE_DEER_LIME  = S('roe_deer',        'Roe Deer',         'fallow_deer_-_roe_deer.png',          ['lime']);
const ROE_DEER_OGE   = S('roe_deer',        'Roe Deer',         'wild_boar_-_roe_deer.png',            ['orange']);
// cardId='squeeker' (with ee) matches the key in ScoringEngine.sideCardScorers
const SQUEAKER_R1    = S('squeeker',        'Squeaker',         'red_fox_-_squeaker.png',              ['brown']);
const SQUEAKER_R2    = S('squeeker',        'Squeaker',         'roe_deer_-_squeaker.png',             ['red']);
const LYNX_R         = S('lynx',            'Lynx',             'violet_carpenter_bee_-_lynx.png',     ['green']);
const EUR_BADGER_R   = S('european_badger', 'European Badger',  'brown_Long eared_bat_-_european_badger.png', ['silver']);
const EUR_HARE_R     = S('european_hare',   'European Hare',    'lynx_-_european_hare.png',            ['lime']);
const WOLF_R         = S('wolf',            'Wolf',             'red_fox_-_wolf.png',                  ['blue']);
const GNAT_R         = S('gnat',            'Gnat',             'wolf-gnat.png',                       ['orange']);
const BEECH_MARTEN_R = S('beech_marten',   'Beech Marten',     'wild_boar_-_beech_marten.png',        ['brown']);
const FALLOW_DEER_R  = S('fallow_deer',     'Fallow Deer',      'red_deer_-_fallow_deer.png',          ['red']);
const RED_FOX_R      = S('red_fox',         'Red Fox',          'lynx_-_red_fox.png',                  ['silver']);

// ── Top cards (TOP half of a top/bottom physical card) ────────────────────

const CHAFFINCH      = TB('chaffinch',                'Chaffinch',                'chaffinch-common_toad.png',              ['green']);
const BULLFINCH_1    = TB('bullfinch',                'Bullfinch',                'bullfinch-tree_frog.png',                ['silver']);
const GOSHAWK_1      = TB('goshawk',                  'Goshawk',                  'goshawk_-_moss.png',                     ['silver']);
const WOODPECKER     = TB('great_spotted_woodpecker', 'Great Spotted Woodpecker', 'great_spotted_woodpecker-wood_ant.png',  ['yellow']);
const EURASIAN_JAY   = TB('eurasian_jay',             'Eurasian Jay',             'eurasian_jay_-_fly_agaric.png',          ['red']);
const RED_SQUIRREL_1 = TB('red_squirrel',             'Red Squirrel',             'red_squirrel_-_fire_salamander.png',     ['green']);
const TAWNY_OWL_1    = TB('tawny_owl',                'Tawny Owl',                'tawny_owl_-_common_toad.png',            ['red']);
const PURPLE_EMPEROR = TB('purple_emperor',           'Purple Emperor',           'purple_emperor_-_pond_turtle.png',       ['orange']);
const CAMBERWELL     = TB('camberwell_beauty',        'Camberwell Beauty',        'camberwell_beauty-tree_frog.png',        ['lime']);
const LG_TORTOISE    = TB('large_tortoiseshell',      'Large Tortoiseshell',      'large_tortoiseshell-blackberries.png',   ['blue']);
const PEACOCK_BTF    = TB('peacock_butterfly',        'Peacock Butterfly',        'peacock_butterfly_-_chanterelle.png',    ['brown']);
const SILV_FRITI     = TB('silver_washed_fritillary', 'Silver-Washed Fritillary', 'silver washed_fritillary-moss.png',     ['green']);
const RED_SQUIRREL_2 = TB('red_squirrel',             'Red Squirrel',             'red_squirrel_-_wild_strawberries.png',   ['brown']);
const BULLFINCH_2    = TB('bullfinch',                'Bullfinch',                'bullfinch_-_hedgehog.png',               ['silver']);
const TAWNY_OWL_2    = TB('tawny_owl',                'Tawny Owl',                'tawny_owl_-_penny_bun.png',              ['lime']);
const GOSHAWK_2      = TB('goshawk',                  'Goshawk',                  'goshawk_-_wood_ant.png',                 ['blue']);

// ── Bottom cards (BOTTOM half of a top/bottom physical card) ──────────────

const COMMON_TOAD    = TB('common_toad',       'Common Toad',       'chaffinch-common_toad.png',                       ['blue']);
// cardId='firefly' (singular) matches the key in ScoringEngine.topBottomCardScorers
const FIREFLY_1      = TB('firefly',           'Fireflies',         'eurasian_jay_-_fireflies.png',                    ['silver']);
const FIREFLY_2      = TB('firefly',           'Fireflies',         'peacock_butterfly-fireflies.png',                 ['green']);
const FIREFLY_3      = TB('firefly',           'Fireflies',         'camberwell_beauty_-_fireflies.png',               ['yellow']);
const FIRE_SALA_1    = TB('fire_salamander',   'Fire Salamander',   'red_squirrel_-_fire_salamander.png',              ['yellow']);
const FIRE_SALA_2    = TB('fire_salamander',   'Fire Salamander',   'large_tortoiseshell-fire_salamander.png',         ['silver']);
const FIRE_SALA_3    = TB('fire_salamander',   'Fire Salamander',   'silver washed_fritillary-fire_salamander.png',   ['orange']);
const FLY_AGARIC     = TB('fly_agaric',        'Fly Agaric',        'eurasian_jay_-_fly_agaric.png',                   ['blue']);
const CHANTERELLE    = TB('chanterelle',       'Chanterelle',       'camberwell_beauty_-_chanterelle.png',             ['lime']);
const TREE_FROG      = TB('tree_frog',         'Tree Frog',         'bullfinch-tree_frog.png',                         ['yellow']);
const POND_TURTLE    = TB('pond_turtle',       'Pond Turtle',       'camberwell_beauty_-_pond_turtle.png',             ['lime']);
const WOOD_ANT       = TB('wood_ant',          'Wood Ant',          'great_spotted_woodpecker-wood_ant.png',           ['lime']);
const MOSS           = TB('moss',              'Moss',              'purple_emperor_-_moss.png',                       ['silver']);
const WILD_STRAW     = TB('wild_strawberries', 'Wild Strawberries', 'red_squirrel_-_wild_strawberries.png',            ['lime']);
const HEDGEHOG       = TB('hedgehog',          'Hedgehog',          'bullfinch_-_hedgehog.png',                        ['green']);
const PENNY_BUN      = TB('penny_bun',         'Penny Bun',         'tawny_owl_-_penny_bun.png',                       ['silver']);
const STAG_BEETLE    = TB('stag_beetle',       'Stag Beetle',       'tawny_owl_-_stag_beetle.png',                     ['red']);
const WOOD_ANT_2     = TB('wood_ant',          'Wood Ant',          'goshawk_-_wood_ant.png',                          ['green']);

// ── Board layout ───────────────────────────────────────────────────────────
//
//  T0  Beech #1   top=Chaffinch(5)           btm=[Toad+Toad](5ea)        left=EurHare(lime)   right=BechsteinBat
//  T1  Beech #2   top=Bullfinch(2×insects)   btm=Firefly#1→leader(15)   left=EurHare(blue)   right=BrownLongBat
//  T2  Beech #3   top=Goshawk(3×birds)       btm=Firefly#2(0,not leader) left=FallowDeer      right=GreaterHorseBat
//  T3  Beech #4   top=Woodpecker(hasMost)    btm=Firefly#3(0,not leader) left=Wolf(silver)    right=RoeDeer(lime)
//  T4  Birch #1   top=EurasianJay(3)         btm=FlyAgaric(3×birch)      left=WildBoar        right=Squeaker
//  T5  Oak        top=RedSquirrel(5)         btm=FireSala#1→leader(25)   left=RoeDeer(blue)   right=Lynx
//  T6  Linden     top=TawnyOwl(5)            btm=PondTurtle(5)           left=EurHare(yellow) right=EurBadger
//  T7  DouglasFir top=PurpleEmperor→btfly#1  btm=TreeFrog(5×gnats)       left=RedDeer(blue)   right=BeechMarten
//  T8  SilverFir  top=CamberwellBeauty       btm=FireSala#2(0,handled)   left=Gnat(lime)      right=EurHare(lime)
//  T9  Sycamore#1 top=LargeTortoiseshell     btm=FireSala#3(0,handled)   left=BeechMarten     right=Wolf(blue)
//  T10 HC#1(ldr)  top=PeacockButterfly       btm=WoodAnt(2×btm cards)    left=RoeDeer(yellow) right=Gnat(orange)
//  T11 HC#2       top=SilvWashedFritillary   btm=Moss(10,≥10trees)       left=RedDeer(yellow) right=FallowDeer
//  T12 HC#3       top=RedSquirrel#2(5)       btm=WildStrawberries(10)    left=Wolf(red)       right=Squeaker#2
//  T13 Birch #2   top=Bullfinch#2            btm=Hedgehog(2×butterflies) left=BeechMarten#2   right=RedFox
//  T14 Sycamore#2 top=TawnyOwl#2             btm=PennyBun(4flat)         left=EurBadger       right=RoeDeer(orange)
//  T15 Birch #3   top=Goshawk#2              btm=StagBeetle(pawed)       left=RedFox(green)   right=RoeDeer(orange)

const BOARD = [
    // T0 — Beech #1: Chaffinch + stacked Common Toad pair, Hare, Bat
    { species: BEECH,          top: CHAFFINCH,     bottom: [COMMON_TOAD, COMMON_TOAD], left: EUR_HARE_LIME,  right: BECHSTEIN_BAT },
    // T1 — Beech #2: Bullfinch counts insects, Firefly #1 becomes leader (25→15 for 3 total)
    { species: BEECH,          top: BULLFINCH_1,   bottom: FIREFLY_1,                  left: EUR_HARE_BLUE,  right: BROWN_LONG_BAT },
    // T2 — Beech #3: Goshawk counts birds, Firefly #2 (0, handled by T1 leader)
    { species: BEECH,          top: GOSHAWK_1,     bottom: FIREFLY_2,                  left: FALLOW_DEER,    right: GR_HORSE_BAT },
    // T3 — Beech #4: 4th Beech triggers 5VP each; Woodpecker; Firefly #3 (0, handled by T1 leader)
    { species: BEECH,          top: WOODPECKER,    bottom: FIREFLY_3,                  left: WOLF_SLV,       right: ROE_DEER_LIME },
    // T4 — Birch #1: Eurasian Jay (3 flat VP), Fly Agaric (3×birch), WildBoar, Squeaker
    { species: BIRCH,          top: EURASIAN_JAY,  bottom: FLY_AGARIC,                 left: WILD_BOAR,      right: SQUEAKER_R1 },
    // T5 — Oak: Red Squirrel (5), Fire Salamander #1 → LEADER (set of 3 = 25 VP)
    { species: OAK,            top: RED_SQUIRREL_1,bottom: FIRE_SALA_1,                left: ROE_DEER_BLU,   right: LYNX_R },
    // T6 — Linden: Tawny Owl (5), Pond Turtle (5), Hare, Badger
    { species: LINDEN,         top: TAWNY_OWL_1,   bottom: POND_TURTLE,                left: EUR_HARE_YEL,   right: EUR_BADGER_R },
    // T7 — Douglas Fir: Purple Emperor (butterfly #1 → set leader), Tree Frog (5×gnats), Red Deer, Beech Marten
    { species: DOUGLAS_FIR,    top: PURPLE_EMPEROR, bottom: TREE_FROG,                 left: RED_DEER_L1,    right: BEECH_MARTEN_R },
    // T8 — Silver Fir: Camberwell Beauty (butterfly #2), Fire Salamander #2 (0, T5 is leader), Gnat, Hare
    { species: SILVER_FIR,     top: CAMBERWELL,    bottom: FIRE_SALA_2,                left: GNAT_L,         right: EUR_HARE_R },
    // T9 — Sycamore #1: Large Tortoiseshell (butterfly #3), Fire Salamander #3 (0, handled), Beech Marten, Wolf
    { species: SYCAMORE,       top: LG_TORTOISE,   bottom: FIRE_SALA_3,                left: BEECH_MARTEN_L1,right: WOLF_R },
    // T10 — HC #1 (leader → 9 VP for 3 HCs): Peacock Butterfly (#4), Wood Ant, Roe Deer, Gnat
    { species: HORSE_CHESTNUT, top: PEACOCK_BTF,   bottom: WOOD_ANT,                   left: ROE_DEER_YEL,   right: GNAT_R },
    // T11 — HC #2: Silver-Washed Fritillary (#5 → set complete!), Moss, Red Deer, Fallow Deer
    { species: HORSE_CHESTNUT, top: SILV_FRITI,    bottom: MOSS,                       left: RED_DEER_L2,    right: FALLOW_DEER_R },
    // T12 — HC #3: Red Squirrel #2, Wild Strawberries, Wolf, Squeaker
    { species: HORSE_CHESTNUT, top: RED_SQUIRREL_2,bottom: WILD_STRAW,                 left: WOLF_RED,       right: SQUEAKER_R2 },
    // T13 — Birch #2: Bullfinch #2, Hedgehog (2×butterflies), Beech Marten, Red Fox
    { species: BIRCH,          top: BULLFINCH_2,   bottom: HEDGEHOG,                   left: BEECH_MARTEN_L2,right: RED_FOX_R },
    // T14 — Sycamore #2: Tawny Owl #2, Penny Bun (4 flat), European Badger, Roe Deer
    { species: SYCAMORE,       top: TAWNY_OWL_2,   bottom: PENNY_BUN,                  left: EUR_BADGER_L,   right: ROE_DEER_OGE },
    // T15 — Birch #3: Goshawk #2, Stag Beetle (pawed animals), Red Fox, Roe Deer
    { species: BIRCH,          top: GOSHAWK_2,     bottom: STAG_BEETLE,                left: RED_FOX_L2,     right: ROE_DEER_OGE },
];

// ── Scenario runner ────────────────────────────────────────────────────────

export function runDebugScenario(state) {
    state.trees = [];

    BOARD.forEach(({ species, top, bottom, left, right }) => {
        state.addTree();
        const id = state.trees[state.trees.length - 1].id;

        state.addCardToSlot(id, 'species', species);

        if (top)    state.addCardToSlot(id, 'top',    top);
        if (bottom) {
            if (Array.isArray(bottom)) {
                // Stacked cards (Common Toad pair): first normal, rest allowStack=true
                bottom.forEach((card, i) => state.addCardToSlot(id, 'bottom', card, i > 0));
            } else {
                state.addCardToSlot(id, 'bottom', bottom);
            }
        }
        if (left)   state.addCardToSlot(id, 'left',  left);
        if (right)  state.addCardToSlot(id, 'right', right);
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

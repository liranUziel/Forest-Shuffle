# Forest Shuffle - Scoring Rules

## Trees

### Silver Fir
**Score Role:** Each Silver Fir in your forest scores 2 points per card</u> attached to <u>that Silver Fir</u> .
*Implementation Note:* The system checks the top, bottom, left, and right slots of the specific Silver Fir tree and multiplies the total array length by 2.

### Sycamore
**Score Role:** Each Sycamore tree scores as many points as there are <u>trees</u>(saplings included) in your forest.
*Implementation Note:* The system counts every tree planted on the board. This includes standard tree cards, saplings, and any bonus tree counts provided by cards like the Violet Carpenter Bee.

### Horse Chestnut
**Score Role:** Horse Chestnuts are scored as a <u>set</u>: 1/2/3/4/5/6/7+ Horse Chestnuts score 1/4/9/16/25/36/49 points total.
*Implementation Note:* To prevent exponential duplication, the engine uses a "Leader" system. The first Horse Chestnut on the board calculates and claims the total score for the entire set. All subsequent Horse Chestnuts return 0 VP.

### Linden
**Score Role:** Each Linden tree scores 1 point. This is increased to 3 if your forest has the <u>most</u> (or tied for the most) Linden trees.
*Implementation Note:* Requires player input. A UI checkbox toggle sets a `hasLindenMost` boolean flag on the card state to calculate the 3 VP spike.


### Beech
**Score Role:** Each Beech scores 5 points, but only if there are at least <u>4 Beeches</u> in your forest.
*Implementation Note:*

### Oak
**Score Role:** Each Oak scores 10 points, but only if your forest contains all <u>8 different tree species</u> (saplings don't count).
*Implementation Note:*

### Douglas Fir
**Score Role:** Each Douglas Fir scores 5 points.
*Implementation Note:*

### Birch
**Score Role:** Each Birch scores 1 points.
*Implementation Note:*

## Birds

### Bullfinch
**Score Role:** Each Bullfinch scores 2 points per **Insect** ![Insect-Icon](Assetes\Icons\Insect.png){height=20px} in your forest
*Implementation Note:*

### Chaffinch
**Score Role:** Each Chaffinch scores 5 points, but only if placed <u>on a Beech tree</u>.
*Implementation Note:*

### Eurasian Jay
**Score Role:** Each Eurasian Jay scores 3 points.
*Implementation Note:*

### Goshawk
**Score Role:** Each Goshawk scores 3 points per **Bird** ![Bird-Icon](Assetes\Icons\Bird.png){height=20px} in your forest
*Implementation Note:*

### Great Spotted Woodpeacker
**Score Role:** Eeac Great Spotted Woodpeacker scores 10 points,but only if you have the <u>most</u>(or tied for the the most) <u>trees</u> in your forest (sapling included).
*Implementation Note:*

### Tawny Owl
**Score Role:** Each Tawny Owl scores 5 points.
*Implementation Note:*

## Butterflies

### Camberwell Beauty
**Score Role:** Butterflies score as a set: 1/2/3/4/5 <u>different</u> butterflies species in your forest scores 0/3/6/12/20 points. you can have several sets, but each card can only be part of one set.
*Implementation Note:*

### Large Tortoiseshell
**Score Role:** Butterflies score as a set: 1/2/3/4/5 <u>different</u> butterflies species in your forest scores 0/3/6/12/20 points. you can have several sets, but each card can only be part of one set.
*Implementation Note:*

### Peacock Butterfly
**Score Role:** Butterflies score as a set: 1/2/3/4/5 <u>different</u> butterflies species in your forest scores 0/3/6/12/20 points. you can have several sets, but each card can only be part of one set.
*Implementation Note:*

### Purple Emperor
**Score Role:** Butterflies score as a set: 1/2/3/4/5 <u>different</u> butterflies species in your forest scores 0/3/6/12/20 points. you can have several sets, but each card can only be part of one set.
*Implementation Note:*

### Silver-Washed Fritillary
**Score Role:** Butterflies score as a set: 1/2/3/4/5 <u>different</u> butterflies species in your forest scores 0/3/6/12/20 points. you can have several sets, but each card can only be part of one set.
*Implementation Note:*

## Pawed-animal

### Red Squirrel
**Score Role:** Each Squirrel scores 5 points, but only if it played <u>on an Oak tree</u>.
*Implementation Note:*

### Hedgehog
**Score Role:** Each Hedgehog scores 2 points per **Butterfly** ![Butterfly-Icon](Assetes\Icons\Butterfly.png){height=20px} in your forest.
*Implementation Note:*

### Mole
**Score Role:** Each hedgehog scores 0 points.
*Implementation Note:*

### Reccoon
**Score Role:** Each Reccoon score 0 points.
*Implementation Note:*

### European Badger
**Score Role:** Each European Badger score 2 points.
*Implementation Note:*

### Red Fox
**Score Role:** Each Red Fox score 2 points <u>per European Hare in your forest</u>.
*Implementation Note:*

### European Hare
**Score Role:** Each European Hare scores <u>as many points</u>. as ther are <u>European Hare</u> in your entire forest.
*Examplpe: You have 5 European Hare in your forest. You score 5 times 5 points for total of 25.*
*Implementation Note:*

### Beech Marten
**Score Role:** Each Beech Marten scores 5 points per <u>fully occupied tree</u>in your forest.
Remember: *fully occuipied* mean that all slots of a tree have at least one card attached.
*Implementation Note:*

### Wolf
**Score Role:** Each Wolf scores 5 points per **deer** ![Deer-Icon](Assetes\Icons\Deer.png){height=20px} in your forest.
*Implementation Note:*

### European Fat Dormouse
**Score Role:** Each Fat Dormouse scores 15 points, but only if there's a bat on the same tree.
*Implementation Note:*

## Lynx
**Score Role:** Each Lynx scores 10 points only if you have at least <u>1 Roe Deer</u> in your forest.
*Exmaple: You have 1 Roe deer and 2 Lynxes. Each Lynix is worth 10 points (20 points total).*
*Implementation Note:*

## Brown Beer
**Score Role:** Each Lynx scores 0 points. 
*Implementation Note:*

## Insect

### Fireflies
**Score Role:** Fireflies are scored as a <u>set</u>: 1/2/3/4 of them score 0/10/15/20 points.
*Implementation Note:*

### Stag Beetle
**Score Role:** Each Stag Beetle scores 1 points per **pawed-animal** ![Pawed-animal-Icon](Assetes\Icons\Pawed-animal.png){height=20px} in your forest.
*Implementation Note:*

### Wood Ant
**Score Role:** Each Wood Ant scores 2 points per card in your forest that is attached <u>bellow a tree</u>.
*Implementation Note:*

### Gnat
**Score Role:** Each Gnat scores 1 points per **bat** ![Bat-Icon](Assetes\Icons\Bat.png){height=20px} in your forest.

## Plant

### Tree Ferns
**Score Role:** Each Tree Ferns scores 6 points per **amphibian** ![Amphibian-Icon](Assetes\Icons\Amphibian.png){height=20px} in your forest.
*Implementation Note:*

### Violet Carpenter Bee
**Score Role:** Each Violet Carpenter Bee scores 0 points.
*Implementation Note:*

### Moss
**Score Role:** Each Moss scores 10 points, but only if you hae at least <u>10 trees</u> (including saplings) in your forest.
*Implementation Note:*


### Wild Strawberries
**Score Role:** Each Wild Strawberries scores 10 points, but only if your forest contains all 8 different tree species (sapling don't count).
*Implementation Note:* 

### Blackberries
**Score Role:** Each Blackberries scores 2 points per **plant** ![Plant-Icon](Assetes\Icons\Plant.png){height=20px} in your forest.
*Implementation Note:* 

## Amphibians

### Pond Turtle
**Score Role:** Each Pond Turtle scores 5 points.
*Implementation Note:*

### Tree Frog
**Score Role:** Each Tree Frog scores 5 points per <u>Gnat</u> in your forest.
*Implementation Note:*

### Common Toad
**Score Role:** Each Common Toad scores 5 points, but only if it <u>shares the slot</u> with another Common Toad
*Implementation Note:*

### Fire Salamander
**Score Role:** Salamander are scored as a <u>set</u>: 1/2/3 of them score 5/15/25 points.
*Implementation Note:*

## Mushrooms

### Chanterelle
**Score Role:** Each Mushroom scores 0 points.
*Implementation Note:*

### Parasol Mushroom
**Score Role:** Each Mushroom scores 0 points.
*Implementation Note:*

### Fly Agaric
**Score Role:** Each Mushroom scores 0 points.
*Implementation Note:*

### Penny Bun
**Score Role:** Each Mushroom scores 0 points.
*Implementation Note:*

## Cloven-hoofed Animal

### Squeaker
**Score Role:** Each Squeaker scores 1 points.
*Implementation Note:*


### Wild Boar
**Score Role:** Each Wild Boar scores 10 ponints, but only if you have at least <u>1 Squeaker</u>
in your forest.
*(Several Boars can use the same Squeaker as scoring prerequisite)*
*Implementation Note:*

## Deer

### Fallow Deer
**Score Role:** Each Fallow Deer scores 3 points per **cloven-hoffed animal** ![Colven-Icon](Assetes\Icons\Cloven-hoofed-animal.png){height=20px} in your forest.
(including itself).
*Implementation Note:* 

### Roe Deer
**Score Role:** Each Roe Deer scores 3 points per corresponding <u>tree symbol</u> in your forest
(including the one on the Roe Deer card).
*Implementation Note:* 

### Red Deer
**Score Role:** Each Red Deer scores 1 points per **tree** ![Tree-Icon](Assetes\Icons\Sapling.png){height=20px}  <u>and</u> in  **plant** ![Plant-Icon](Assetes\Icons\Plant.png){height=20px} your forest.
*Implementation Note:* 

## Bat

### Barbastelle Bat
**Score Role:** Each Bat scores 5 points, but only if threre are at least <u>three different bat</u> species in your forest (including this one).
*Implementation Note:* 

### Bechstein's Bat
**Score Role:** Each Bat scores 5 points, but only if threre are at least <u>three different bat</u> species in your forest (including this one).
*Implementation Note:* 

### Brown Long-Eared Bat
**Score Role:** Each Bat scores 5 points, but only if threre are at least <u>three different bat</u> species in your forest (including this one).
*Implementation Note:* 

### Greater Horse-shoe Bat
**Score Role:** Each Bat scores 5 points, but only if threre are at least <u>three different bat</u> species in your forest (including this one).
*Implementation Note:* 

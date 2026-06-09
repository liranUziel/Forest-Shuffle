  // if (cardId === 'squeeker') {
        //     return {
        //         points: 1,
        //         calculated: true,
        //         detail: 'Side case: Squeeker = 1',
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'badger') {
        //     return {
        //         points: 2,
        //         calculated: true,
        //         detail: 'Side case: European Badger = 2',
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'roe_deer') {
        //     const colors = (cardInput && cardInput.colors) || [];
        //     const isBlueRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'blue');
        //     const isYellowRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'yellow');
        //     const isGreenRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'green');
        //     const isLimeRoeDeer = colors.some((color) => Helpers.normalizeName(color) === 'lime');

        //     if (isBlueRoeDeer) {
        //         const blueTypeCount = this.getColorTypeCardCount(boardObject, 'blue', 'silver_fir');
        //         return {
        //             points: blueTypeCount * 3,
        //             calculated: true,
        //             detail: `Side case: Roe Deer (Blue) blue_cards+silver_fir(${blueTypeCount}) x 3 = ${blueTypeCount * 3}`,
        //             ruleType: 'SIDE_CASE'
        //         };
        //     }

        //     if (isYellowRoeDeer) {
        //         const yellowTypeCount = this.getColorTypeCardCount(boardObject, 'yellow', 'linden');
        //         return {
        //             points: yellowTypeCount * 3,
        //             calculated: true,
        //             detail: `Side case: Roe Deer (Yellow) yellow_cards+linden(${yellowTypeCount}) x 3 = ${yellowTypeCount * 3}`,
        //             ruleType: 'SIDE_CASE'
        //         };
        //     }

        //     if (isGreenRoeDeer) {
        //         const greenTypeCount = this.getColorTypeCardCount(boardObject, 'green', 'beech');
        //         return {
        //             points: greenTypeCount * 3,
        //             calculated: true,
        //             detail: `Side case: Roe Deer (Green) green_cards+beech(${greenTypeCount}) x 3 = ${greenTypeCount * 3}`,
        //             ruleType: 'SIDE_CASE'
        //         };
        //     }

        //     if (isLimeRoeDeer) {
        //         const limeTypeCount = this.getColorTypeCardCount(boardObject, 'lime', null);
        //         return {
        //             points: limeTypeCount * 3,
        //             calculated: true,
        //             detail: `Side case: Roe Deer (Lime) lime_cards(${limeTypeCount}) x 3 = ${limeTypeCount * 3}`,
        //             ruleType: 'SIDE_CASE'
        //         };
        //     }

        //     return {
        //         points: 0,
        //         calculated: true,
        //         detail: 'Side case: Roe Deer inactive (no blue/yellow/green/lime variant detected)',
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'lynx') {
        //     const sideEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     const hasRoeDeer = sideEntries.some((entry) => {
        //         if (!entry || !entry.card) return false;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         return entryId === 'roe_deer';
        //     });

        //     return {
        //         points: hasRoeDeer ? 10 : 0,
        //         calculated: true,
        //         detail: hasRoeDeer
        //             ? 'Side case: Lynx with Roe Deer present = 10'
        //             : 'Side case: Lynx inactive (no Roe Deer present)',
        //         ruleType: 'SIDE_CASE'
        //     };
        // }
                // if (cardId === 'european_hare') {
        //     const sideEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     const hareCount = sideEntries.reduce((acc, entry) => {
        //         if (!entry || !entry.card) return acc;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         return acc + (entryId === 'european_hare' ? 1 : 0);
        //     }, 0);

        //     return {
        //         points: hareCount,
        //         calculated: true,
        //         detail: `Side case: European Hare european_hare(${hareCount}) x 1 = ${hareCount}`,
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'red_deer') {
        //     const plantCount = this.getRedDeerPlantCount(boardObject);
        //     const treeCount = this.getPlantedTreeCount(boardObject);
        //     const points = plantCount + treeCount;

        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Side case: Red Deer plants(${plantCount}) + trees(${treeCount}) = ${points}`,
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'fallow_deer') {
        //     const clovenHoofedCount = this.getClovenHoofedAnimalCount(boardObject);
        //     const points = clovenHoofedCount * 3;

        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Side case: Fallow Deer cloven_hoofed(${clovenHoofedCount}) x 3 = ${points}`,
        //         ruleType: 'SIDE_CASE'
        //     };
        // }
            // if (cardId === 'red_fox') {
        //     const sideEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     const europeanHareCount = sideEntries.reduce((acc, entry) => {
        //         if (!entry || !entry.card) return acc;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         return acc + (entryId === 'european_hare' ? 1 : 0);
        //     }, 0);

        //     return {
        //         points: europeanHareCount * 2,
        //         calculated: true,
        //         detail: `Side case: Red Fox european_hare(${europeanHareCount}) x 2 = ${europeanHareCount * 2}`,
        //         ruleType: 'SIDE_CASE'
        //     };
        // }
         // if (cardId === 'gnat') {
        //     const batCount = this.getBatCardCount(boardObject);
        //     return {
        //         points: batCount,
        //         calculated: true,
        //         detail: `Side case: Gnat bats(${batCount}) x 1 = ${batCount}`,
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'wolf') {
        //     const sideEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     const deerCount = sideEntries.reduce((acc, entry) => {
        //         if (!entry || !entry.card) return acc;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         return acc + (entryId === 'roe_deer' || entryId === 'red_deer' || entryId === 'fallow_deer' ? 1 : 0);
        //     }, 0);
        //     const points = deerCount * 5;

        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Side case: Wolf deer(${deerCount}) x 5 = ${points}`,
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'beech_marten') {
        //     const fullTreeCount = this.getFullyOccupiedTreeCount(boardObject);
        //     return {
        //         points: fullTreeCount * 5,
        //         calculated: true,
        //         detail: `Side case: Beech Marten full_trees(${fullTreeCount}) x 5 = ${fullTreeCount * 5}`,
        //         ruleType: 'SIDE_CASE'
        //     };
        // }

        // if (cardId === 'wild_boar') {
        //     const sideEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     const hasSqueeker = sideEntries.some((entry) => {
        //         if (!entry || !entry.card) return false;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         return entryId === 'squeeker';
        //     });

        //     return {
        //         points: hasSqueeker ? 10 : 0,
        //         calculated: true,
        //         detail: hasSqueeker
        //             ? 'Side case: Wild Boar with Squeeker present = 10'
        //             : 'Side case: Wild Boar inactive (no Squeeker present)',
        //         ruleType: 'SIDE_CASE'
        //     };
        // }


          // if (cardId === 'pond_turtle') {
        //     return {
        //         points: this.topBottomCasesVp.pond_turtle,
        //         calculated: true,
        //         detail: 'Top/Bottom case: Pond Turtle x 5',
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'chaffinch') {
        //     const speciesId = this.getSpeciesIdFromCard(currentTree && currentTree.species);
        //     const active = speciesId === 'beech';
        //     return {
        //         points: active ? this.topBottomCasesVp.chaffinch : 0,
        //         calculated: true,
        //         detail: active
        //             ? 'Top/Bottom case: Chaffinch on Beech = 5'
        //             : `Top/Bottom case: Chaffinch inactive (${speciesId || 'no tree'}` + ')',
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'eurasian_jay') {
        //     return {
        //         points: this.topBottomCasesVp.eurasian_jay,
        //         calculated: true,
        //         detail: 'Top/Bottom case: Eurasian Jay = 3',
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'tawny_owl') {
        //     return {
        //         points: 5,
        //         calculated: true,
        //         detail: 'Top/Bottom case: Tawny Owl = 5',
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        
        // if (cardId === 'goshawk') {
        //     const birdCount = this.getGoshawkBirdCount(boardObject);
        //     const points = birdCount * 3;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Goshawk birds(${birdCount}) x 3 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'great_spotted_woodpecker') {
        //     const hasMost = !!(cardInput && cardInput.hasMost);
        //     return {
        //         points: hasMost ? 10 : 0,
        //         calculated: true,
        //         detail: hasMost
        //             ? 'Top/Bottom case: Great Spotted Woodpecker (Most) = 10'
        //             : 'Top/Bottom case: Great Spotted Woodpecker inactive (Most unchecked)',
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

          // if (cardId === 'wood_ant') {
        //     const totalBottomCards = ((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []).length;
        //     const points = totalBottomCards * this.topBottomCasesVp.wood_ant;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Wood Ant bottom cards(${totalBottomCards}) x 2 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'tree_frog') {
        //     const attachedEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     let gnatCount = 0;
        //     attachedEntries.forEach((entry) => {
        //         if (!entry || !entry.card) return;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         if (entryId === 'gnat') gnatCount += 1;
        //     });

        //     const points = gnatCount * this.topBottomCasesVp.tree_frog;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Tree Frog gnat(${gnatCount}) x 5 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

                // if (cardId === 'blackberries') {
        //     const topBottomEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || [])
        //     ];
        //     const blackberryPlantIds = new Set(['blackberries', 'tree_ferns', 'tree_fern', 'moss', 'wild_strawberries']);
        //     let blackberryPlantCount = 0;
        //     topBottomEntries.forEach((entry) => {
        //         if (!entry || !entry.card) return;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         if (blackberryPlantIds.has(entryId)) blackberryPlantCount += 1;
        //     });

        //     const points = blackberryPlantCount * this.topBottomCasesVp.blackberries;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Blackberries plants(${blackberryPlantCount}) x 2 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

                // if (cardId === 'fire_salamander') {
        //     const counts = this.evaluate_top_bottom(boardObject).counts;
        //     const fireCount = counts.fire_salamander || 0;
        //     const setScore = fireCount >= 3 ? 25 : (fireCount === 2 ? 15 : (fireCount === 1 ? 5 : 0));
        //     const leaderTreeId = this.getFireSalamanderLeaderTreeId(boardObject);
        //     const isLeader = !!(currentTree && currentTree.id && currentTree.id === leaderTreeId);

        //     if (isLeader) {
        //         return {
        //             points: setScore,
        //             calculated: true,
        //             detail: `Top/Bottom case: Fire Salamander set ${fireCount} -> ${setScore} (counted once)`,
        //             ruleType: 'TOP_BOTTOM_CASE'
        //         };
        //     }

        //     return {
        //         points: 0,
        //         calculated: true,
        //         detail: `Top/Bottom case: Fire Salamander set handled by one card (${fireCount} -> ${setScore})`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'firefly') {
        //     const counts = this.evaluate_top_bottom(boardObject).counts;
        //     const fireflyCount = counts.firefly || 0;
        //     const setScore = this.getFireflySetScore(fireflyCount);
        //     const leaderTreeId = this.getFireflyTopBottomLeaderTreeId(boardObject);
        //     const isLeader = !!(currentTree && currentTree.id && currentTree.id === leaderTreeId);

        //     if (isLeader) {
        //         return {
        //             points: setScore,
        //             calculated: true,
        //             detail: `Top/Bottom case: Fireflies set ${fireflyCount} -> ${setScore} (counted once)`,
        //             ruleType: 'TOP_BOTTOM_CASE'
        //         };
        //     }

        //     return {
        //         points: 0,
        //         calculated: true,
        //         detail: `Top/Bottom case: Fireflies set handled by one card (${fireflyCount} -> ${setScore})`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

      

        // if (cardId === 'common_toad') {
        //     const bottomCards = (currentTree && currentTree.bottom) || [];
        //     const bottomCommonToads = bottomCards.reduce((acc, card) => {
        //         const id = Helpers.normalizeName(card && (card.cardId || card.name));
        //         return acc + (id === 'common_toad' ? 1 : 0);
        //     }, 0);
        //     const active = bottomCommonToads >= 2;
        //     return {
        //         points: active ? this.topBottomCasesVp.common_toad : 0,
        //         calculated: true,
        //         detail: active
        //             ? `Top/Bottom case: Common Toad pair active (${bottomCommonToads} on this tree bottom) = 5`
        //             : `Top/Bottom case: Common Toad pair inactive (${bottomCommonToads}/2 on this tree bottom)`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }



        // if (cardId === 'hedgehog') {
        //     const attachedEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     const hedgehogButterflyIds = new Set([
        //         'silver_washed_fritillary',
        //         'large_tortoiseshell',
        //         'camberwell_beauty',
        //         'peacock_butterfly',
        //         'purple_emperor'
        //     ]);
        //     let hedgehogButterflyCount = 0;
        //     attachedEntries.forEach((entry) => {
        //         if (!entry || !entry.card) return;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         if (hedgehogButterflyIds.has(entryId)) hedgehogButterflyCount += 1;
        //     });

        //     const points = hedgehogButterflyCount * this.topBottomCasesVp.hedgehog;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Hedgehog butterflies(${hedgehogButterflyCount}) x 2 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'stag_beetle') {
        //     const attachedEntries = [
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.top) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.bottom) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.left) || []),
        //         ...((boardObject && boardObject.bySlot && boardObject.bySlot.right) || [])
        //     ];
        //     const stagBeetlePawedAnimalIds = this.getStagBeetlePawedAnimalIds();
        //     let stagBeetlePawedAnimalCount = 0;
        //     attachedEntries.forEach((entry) => {
        //         if (!entry || !entry.card) return;
        //         const entryId = Helpers.normalizeName(entry.card.cardId || entry.card.name);
        //         if (stagBeetlePawedAnimalIds.has(entryId)) stagBeetlePawedAnimalCount += 1;
        //     });

        //     const points = stagBeetlePawedAnimalCount * this.topBottomCasesVp.stag_beetle;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Stag Beetle pawed animals(${stagBeetlePawedAnimalCount}) x 1 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'fly_agaric') {
        //     const birchCount = (this.getTreeSpeciesCounts(boardObject).birch || 0);
        //     const points = birchCount * this.topBottomCasesVp.fly_agaric;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Fly Agaric birch(${birchCount}) x 3 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'chanterelle') {
        //     const oakCount = (this.getTreeSpeciesCounts(boardObject).oak || 0);
        //     const points = oakCount * this.topBottomCasesVp.chanterelle;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Chanterelle oak(${oakCount}) x 5 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'penny_bun') {
        //     const horseChestnutCount = (this.getTreeSpeciesCounts(boardObject).horse_chestnut || 0);
        //     const points = horseChestnutCount * this.topBottomCasesVp.penny_bun;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Penny Bun horse_chestnut(${horseChestnutCount}) x 4 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

                // if (cardId === 'parasol_mushroom') {
        //     return {
        //         points: 0,
        //         calculated: true,
        //         detail: 'Top/Bottom case: Parasol Mushroom currently 0 VP',
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'mole') {
        //     return {
        //         points: 0,
        //         calculated: true,
        //         detail: 'Top/Bottom case: Mole currently 0 VP',
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

                // if (cardId === 'red_squirrel') {
        //     const speciesId = this.getSpeciesIdFromCard(currentTree && currentTree.species);
        //     const active = speciesId === 'oak';
        //     return {
        //         points: active ? this.topBottomCasesVp.red_squirrel : 0,
        //         calculated: true,
        //         detail: active
        //             ? 'Top/Bottom case: Red Squirrel on Oak = 5'
        //             : `Top/Bottom case: Red Squirrel inactive (${speciesId || 'no tree'} not oak)`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }

        // if (cardId === 'bullfinch') {
        //     const insectCount = this.getBullfinchInsectCount(boardObject);
        //     const points = insectCount * 2;
        //     return {
        //         points,
        //         calculated: true,
        //         detail: `Top/Bottom case: Bullfinch insects(${insectCount}) x 2 = ${points}`,
        //         ruleType: 'TOP_BOTTOM_CASE'
        //     };
        // }
/**
 * DeckLoader.js — fetches Assetes/Data/base_forest_shffle_deck.json and
 * exposes it as window.MasterDeck, shared by main.js (the live board) and
 * any other page (e.g. Rules.html) that needs the card catalogue without
 * the rest of the game bootstrap.
 */

import { adaptDeck } from './DeckAdapter.js';

let loadPromise = null;

export function ensureDeckLoaded() {
    if (window.MasterDeck?.deck) return Promise.resolve(window.MasterDeck);
    loadPromise ??= fetch('Assetes/Data/base_forest_shffle_deck.json')
        .then(r => r.json())
        .then(rawDeck => {
            window.MasterDeck = { deck: adaptDeck(rawDeck.deck) };
            return window.MasterDeck;
        });
    return loadPromise;
}

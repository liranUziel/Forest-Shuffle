/**
 * main.js — application entry point.
 * Fetches master_deck.json, initialises ForestState, UIManager, and AutomaDeck.
 */

import { ForestState } from './state/ForestState.js';
import { UIManager }   from './ui/UIManager.js';
import { AutomaDeck }  from './solo/AutomaDeck.js';
import { ScoringEngine } from './scoring/ScoringEngine.js';
import { runDebugScenario } from './demo/debugTools.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const deckData = await fetch('master_deck.json').then(r => r.json());

        // Shared globally so UIManager and scoring files can access the card catalogue.
        window.MasterDeck = deckData;

        // Register scoring rules from the parsed deck (enables resolveCardMeta lookups).
        if (deckData.rules) ScoringEngine.registerRules(deckData.rules);

        const state = new ForestState();
        window.gameState = state;  // exposed for F12 console debugging

        new UIManager(state, 'forest-container');
        new AutomaDeck();

        // Shift+D runs the debug fill scenario (development only).
        document.addEventListener('keydown', e => {
            if (e.shiftKey && (e.key === 'D' || e.key === 'd')) runDebugScenario(state);
        });

    } catch (err) {
        console.error('Forest Shuffle failed to boot:', err);
    }
});


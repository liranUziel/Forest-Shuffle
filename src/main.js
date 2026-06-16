/**
 * main.js — application entry point.
 * Fetches Assetes/Data/base_forest_shffle_deck.json, adapts it into the
 * { deck: [{ filename, split_type, content }] } shape the UI/CardModal expect,
 * then initialises ForestState, UIManager, and AutomaDeck.
 */

import { ForestState } from './state/ForestState.js';
import { UIManager }   from './ui/UIManager.js';
import { AutomaDeck }  from './solo/AutomaDeck.js';
import { runDebugScenario } from './demo/debugTools.js';
import { ensureDeckLoaded } from './state/DeckLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await ensureDeckLoaded();

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


// src/main.js
import { ForestState } from './state/ForestState.js';
import { UIManager } from './ui/UIManager.js';
import { ScoringEngine } from './scoring/ScoringEngine.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Main Module is running! Booting up...');
    
    const [deckRes, rulesRes] = await Promise.all([
        fetch('master_deck.json'),
        fetch('cards.json')
    ]);
    
    window.MasterDeck = await deckRes.json();
    
    if (typeof ScoringEngine !== 'undefined' && typeof ScoringEngine.registerRules === 'function') {
        ScoringEngine.registerRules(await rulesRes.json());
    }
    
    const state = new ForestState();
    const ui = new UIManager(state, 'forest-container');
    
    if (state.trees.length === 0) state.addTree();
    else state.notify();
});
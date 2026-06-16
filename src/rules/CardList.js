/**
 * CardList.js — populates the Rules page's left-side list of every unique
 * card. Clicking a card opens the shared scoring-info popup showing its
 * rule text and a live scoring demo.
 */

import { ensureDeckLoaded } from '../state/DeckLoader.js';
import { buildCardLookup } from './CardDemos.js';
import { loadScoringRules } from './RulesData.js';
import { openScoringInfoPopup } from './ScoringInfoPopup.js';

(async function init() {
    const listEl = document.getElementById('card-list');
    const searchEl = document.getElementById('card-list-search');
    if (!listEl) return;

    await ensureDeckLoaded();
    const lookup = buildCardLookup();
    const rules = await loadScoringRules();

    const entries = Object.keys(lookup).map(id => ({
        id,
        name: rules[id]?.displayName ?? lookup[id].name,
        data: lookup[id],
    })).sort((a, b) => a.name.localeCompare(b.name));

    function render(filterText = '') {
        const f = filterText.trim().toLowerCase();
        listEl.innerHTML = entries
            .filter(e => e.name.toLowerCase().includes(f))
            .map(e => `
                <li class="card-list-item" data-card-id="${e.id}">
                    <img src="Assetes/Images/Cards/${e.data.folder}/${e.data.filename}" alt="${e.name}" loading="lazy" onerror="this.style.display='none'">
                    <span>${e.name}</span>
                </li>
            `).join('');
    }
    render();

    searchEl?.addEventListener('input', () => render(searchEl.value));

    listEl.addEventListener('click', e => {
        const item = e.target.closest('.card-list-item');
        if (item) openScoringInfoPopup(item.dataset.cardId);
    });
})();

/**
 * ScoringInfoPopup.js — shared "how does this card score" popup, used by both
 * the Rules page's card list and Scoring.html's on-board cards. Creates its
 * own modal markup lazily so neither page needs to hand-author it.
 *
 * Shows: the card image, the rule-book "Score Role" text (from
 * Scoring Rules.md), and a live demo computed by the real ScoringEngine —
 * a flat value, a low/high pair (red cross / green check), or a butterfly
 * set breakdown, depending on the card's scoring shape.
 */

import { loadScoringRules } from './RulesData.js';
import { buildCardLookup, getCardDemo } from './CardDemos.js';

const SET_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#14b8a6'];

let rulesPromise = null;
let cachedLookup = null;
let modalEl = null;

function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.id = 'scoring-info-modal';
    modalEl.className = 'modal hidden';
    modalEl.innerHTML = `
        <div class="modal-content scoring-info-content">
            <div class="modal-header">
                <h2 id="scoring-info-title">Card</h2>
                <button id="scoring-info-close">&times;</button>
            </div>
            <div class="scoring-info-body">
                <img id="scoring-info-image" class="scoring-info-image" alt="">
                <div id="scoring-info-role" class="scoring-info-role"></div>
            </div>
            <div id="scoring-info-demo" class="scoring-info-demo"></div>
        </div>
    `;
    document.body.appendChild(modalEl);
    modalEl.querySelector('#scoring-info-close').addEventListener('click', () => modalEl.classList.add('hidden'));
    modalEl.addEventListener('click', e => { if (e.target === modalEl) modalEl.classList.add('hidden'); });
    return modalEl;
}

function imgTag(card, size) {
    if (!card) return '';
    return `<img src="Assetes/Images/Cards/${card.folder}/${card.filename}" alt="${card.name}" style="width:${size}px" onerror="this.style.display='none'">`;
}

function pointsTag(points) {
    return `<span class="demo-points">${points}<img src="Assetes/Icons/Points.png" class="score-icon" alt=""></span>`;
}

function renderFlat(cardData, demo) {
    const c = demo.cases[0];
    return `<div class="demo-flat-case">
        ${imgTag(cardData, 90)}
        ${pointsTag(c.points)}
    </div>`;
}

function renderConditionalLike(cardData, demo) {
    return `<div class="demo-cases">${demo.cases.map(c => {
        const active = c.points > 0;
        return `<div class="demo-case ${active ? 'is-active' : 'is-inactive'}">
            <div class="demo-case-icon">${active ? '&#10003;' : '&#10007;'}</div>
            <div class="demo-case-cards">
                ${imgTag(cardData, 56)}
                ${(c.auxCards ?? []).map(a => imgTag(a, 56)).join('')}
            </div>
            <div class="demo-case-result">${pointsTag(c.points)}</div>
            ${c.detail ? `<div class="demo-case-detail">${c.detail}</div>` : ''}
        </div>`;
    }).join('')}</div>`;
}

function renderSetSpecies(demo) {
    const bySet = new Map();
    demo.cards.forEach(c => {
        if (!bySet.has(c.setIndex)) bySet.set(c.setIndex, []);
        bySet.get(c.setIndex).push(c);
    });
    return `<div class="demo-cases demo-set-species">${Array.from(bySet.entries()).map(([setIndex, cards]) => {
        const color = SET_COLORS[setIndex % SET_COLORS.length];
        const total = cards.reduce((sum, c) => sum + c.points, 0);
        return `<div class="demo-set-group">
            <div class="demo-case-cards">${cards.map(c => `
                <div class="demo-card-chip" style="border:3px solid ${color}; border-radius:8px; padding:2px;">
                    ${imgTag(c.card, 56)}
                </div>`).join('')}</div>
            <div class="demo-case-result">${cards.length} unique &rarr; ${pointsTag(total)}</div>
        </div>`;
    }).join('')}</div>`;
}

/** Opens the popup for the given normalized card id. Safe to call repeatedly. */
export async function openScoringInfoPopup(cardId) {
    const modal = ensureModal();
    cachedLookup ??= buildCardLookup();
    rulesPromise ??= loadScoringRules();
    const rules = await rulesPromise;

    const cardData = cachedLookup[cardId];
    const ruleEntry = rules[cardId];
    const demo = getCardDemo(cardId, cachedLookup);

    modal.querySelector('#scoring-info-title').textContent = ruleEntry?.displayName ?? cardData?.name ?? cardId;
    const image = modal.querySelector('#scoring-info-image');
    if (cardData) { image.src = `Assetes/Images/Cards/${cardData.folder}/${cardData.filename}`; image.style.display = ''; }
    else image.style.display = 'none';
    modal.querySelector('#scoring-info-role').innerHTML = ruleEntry?.scoreRoleHtml ?? '<p><em>No rule text written for this card yet.</em></p>';

    let demoHtml = '<p class="score-empty">No live demo available for this card.</p>';
    if (demo) {
        if (demo.shape === 'flat') demoHtml = renderFlat(cardData, demo);
        else if (demo.shape === 'set-species') demoHtml = renderSetSpecies(demo);
        else demoHtml = renderConditionalLike(cardData, demo);
    }
    modal.querySelector('#scoring-info-demo').innerHTML = demoHtml;

    modal.classList.remove('hidden');
}

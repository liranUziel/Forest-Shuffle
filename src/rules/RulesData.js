/**
 * RulesData.js — fetches "Scoring Rules.md" and parses each card's
 * "Score Role" text (the rule-book prose meant for players) into HTML,
 * keyed by normalized card id. Implementation Notes are intentionally
 * skipped — those are authoring notes for the scoring code, not players.
 */

import { Helpers } from '../scoring/Helpers.js';

const MD_PATH = 'Scoring Rules.md';

function escapeHtml(text) {
    return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/** Converts the limited markdown subset used in the rules file into HTML. */
function convertInlineFormatting(text) {
    return text
        // ![Alt](path\to\icon.png){height=20px} -> <img>. Run before bold/italic
        // so brackets/asterisks inside alt text don't get mangled.
        .replace(/!\[([^\]]*)\]\(([^)]+)\)\{height=(\d+)px\}/g, (_, alt, path, h) =>
            `<img src="${path.replace(/\\/g, '/')}" alt="${escapeHtml(alt)}" height="${h}" class="rule-inline-icon">`)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Parses the raw markdown text into { normalizedId: { displayName, scoreRoleHtml } }. */
function parseMarkdown(text) {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    const cards = {};
    let i = 0;

    while (i < lines.length) {
        const headingMatch = lines[i].match(/^#{2,3}\s+(.+)$/);
        if (!headingMatch) { i++; continue; }
        const displayName = headingMatch[1].trim();
        i++;

        const blockLines = [];
        while (i < lines.length && !/^#{2,3}\s+/.test(lines[i])) {
            blockLines.push(lines[i]);
            i++;
        }

        const roleLineIdx = blockLines.findIndex(l => /^\*\*Score Role:?\*\*/i.test(l.trim()));
        if (roleLineIdx === -1) continue; // category header, not a card entry

        const roleLines = [];
        for (let j = roleLineIdx; j < blockLines.length; j++) {
            const trimmed = blockLines[j].trim();
            if (/^\*Implementation Note:?\*/i.test(trimmed)) break;
            roleLines.push(blockLines[j]);
        }
        roleLines[0] = roleLines[0].replace(/^\s*\*\*Score Role:?\*\*\s*/i, '');

        const html = roleLines.join('\n').trim()
            .split(/\n\s*\n+/)
            .filter(p => p.trim())
            .map(para => `<p>${convertInlineFormatting(para.trim()).replace(/\n/g, '<br>')}</p>`)
            .join('');

        const normalizedId = Helpers.normalizeName(displayName);
        cards[normalizedId] = { displayName, scoreRoleHtml: html };
    }

    return cards;
}

let cachedRulesPromise = null;

/** Fetches + parses Scoring Rules.md once, caching the result for subsequent calls. */
export function loadScoringRules() {
    if (!cachedRulesPromise) {
        cachedRulesPromise = fetch(MD_PATH)
            .then(res => res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`)))
            .then(parseMarkdown)
            .catch(err => { console.info('Scoring Rules.md not available:', err?.message || err); return {}; });
    }
    return cachedRulesPromise;
}

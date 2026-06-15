/**
 * AutomaDeck — solo play Automa card drawer.
 *
 * The Automa deck is 20 fixed action cards. Negative value = Automa takes
 * cards from the forest display (dir = 'left' or 'right' indicates which
 * end). Positive value = cards are added to the display (no direction).
 */

const AUTOMA_CARDS = [
    // Group 1 — large left/right + refills
    { value: -4, dir: 'left'  },
    { value:  4, dir: null    },
    { value:  2, dir: null    },
    { value: -2, dir: 'right' },
    // Group 2 — mirror of group 1
    { value: -4, dir: 'right' },
    { value:  4, dir: null    },
    { value:  2, dir: null    },
    { value: -2, dir: 'right' },
    // Group 3 — medium left actions
    { value: -3, dir: 'left'  },
    { value:  3, dir: null    },
    { value: -2, dir: 'left'  },
    { value: -1, dir: 'left'  },
    // Group 4 — medium right actions
    { value: -3, dir: 'right' },
    { value:  3, dir: null    },
    { value: -2, dir: 'left'  },
    { value: -1, dir: 'left'  },
    // Group 5 — single-card actions (unique)
    { value: -1, dir: 'right' },
    { value: -1, dir: 'right' },
    { value:  1, dir: null    },
    { value:  1, dir: null    },
];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export class AutomaDeck {
    constructor() {
        this.deck      = AUTOMA_CARDS;
        this.drawPile  = shuffle(this.deck);
        this.isAnimating = false;

        this._button   = null;
        this._modal    = null;
        this._pileEl   = null;
        this._revealEl = null;
        this._countEl  = null;

        this._initUI();
    }

    _initUI() {
        const tryInit = () => {
            const container = document.getElementById('automa-controls');
            if (!container) { setTimeout(tryInit, 100); return; }
            if (this._button) return;

            this._button = document.createElement('button');
            this._button.className = 'automa-open-btn';
            this._button.textContent = 'Automa Deck';
            this._button.onclick = () => this._open();
            container.appendChild(this._button);

            this._modal    = document.getElementById('automa-modal');
            this._pileEl   = document.getElementById('deck-pile');
            this._revealEl = document.getElementById('card-reveal');
            this._countEl  = document.getElementById('deck-count');

            document.getElementById('close-automa').onclick   = () => this._close();
            document.getElementById('shuffle-automa').onclick = () => this._shuffle();
            this._pileEl.onclick = () => this._draw();

            this._updateCount();
        };
        tryInit();
    }

    _open()  { this._modal.classList.remove('hidden'); }
    _close() { this._modal.classList.add('hidden'); }

    _draw() {
        if (this.isAnimating || this.drawPile.length === 0) return;
        this.isAnimating = true;
        this._pileEl.classList.add('flipping');

        setTimeout(() => {
            const card = this.drawPile.pop();
            this._renderCard(card);
            this._pileEl.classList.remove('flipping');
            this._updateCount();
            this.isAnimating = false;

            if (this.drawPile.length === 0) this._shuffle();
        }, 300);
    }

    _renderCard(card) {
        const valueStr  = (card.value > 0 ? '+' : '') + card.value;
        const leftArrow = card.dir === 'left'  ? '◂' : '';
        const rightArrow= card.dir === 'right' ? '▸' : '';
        const faceClass = card.value > 0 ? 'automa-card--add' : 'automa-card--take';
        const hint      = card.dir === 'left'  ? 'from left'
                        : card.dir === 'right' ? 'from right'
                        : 'add to display';

        this._revealEl.innerHTML = `
            <div class="automa-action-face ${faceClass}">
                <div class="automa-action-row">
                    <span class="automa-dir">${leftArrow}</span>
                    <span class="automa-action-value">${valueStr}</span>
                    <span class="automa-dir">${rightArrow}</span>
                </div>
                <div class="automa-action-hint">${hint}</div>
            </div>
        `;
        this._revealEl.classList.remove('hidden');
    }

    _shuffle() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this._pileEl.classList.add('shuffling');
        this._pileEl.textContent = '...';
        this._revealEl.classList.add('hidden');
        this._revealEl.innerHTML = '';

        setTimeout(() => {
            this.drawPile = shuffle(this.deck);
            this._pileEl.textContent = 'DRAW';
            this._pileEl.classList.remove('shuffling');
            this._updateCount();
            this.isAnimating = false;
        }, 1200);
    }

    _updateCount() {
        if (this._countEl)
            this._countEl.textContent = `${this.drawPile.length} / ${this.deck.length} cards`;
    }
}

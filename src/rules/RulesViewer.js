/**
 * RulesViewer.js — renders Assetes/Rules.pdf onto a canvas (via pdf.js) inside
 * a book-styled frame, with prev/next arrows that trigger a CSS 3D page-flip.
 * Canvas rendering means there's no native browser PDF toolbar/tooltips.
 */

import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.mjs';

const PDF_PATH = 'Assetes/Files/Rules/BaseGameRules(Eng).pdf';

const bookFrame  = document.getElementById('book-frame');
const bookPage    = document.getElementById('book-page');
const canvas      = document.getElementById('pdf-canvas');
const flipOverlay = document.getElementById('flip-overlay');
const flipCanvas  = document.getElementById('flip-canvas');
const prevBtn      = document.getElementById('prev-page-btn');
const nextBtn      = document.getElementById('next-page-btn');
const pageIndicator = document.getElementById('page-indicator');

let pdfDoc = null;
let currentPage = 1;
let isFlipping = false;

async function renderPage(targetCanvas, pageNumber) {
    const page = await pdfDoc.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = bookPage.clientWidth || 400;
    const scale = (cssWidth * dpr) / baseViewport.width;
    const viewport = page.getViewport({ scale });

    targetCanvas.width  = viewport.width;
    targetCanvas.height = viewport.height;
    targetCanvas.style.width  = `${viewport.width / dpr}px`;
    targetCanvas.style.height = `${viewport.height / dpr}px`;

    const ctx = targetCanvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
}

function updateControls() {
    pageIndicator.textContent = `Page ${currentPage} / ${pdfDoc.numPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= pdfDoc.numPages;
}

async function flipTo(targetPage, direction) {
    if (!pdfDoc || isFlipping) return;
    if (targetPage < 1 || targetPage > pdfDoc.numPages || targetPage === currentPage) return;

    isFlipping = true;

    // Snapshot the current page onto the overlay so it can animate away,
    // then render the new page underneath while the overlay still covers it.
    flipCanvas.width  = canvas.width;
    flipCanvas.height = canvas.height;
    flipCanvas.style.width  = canvas.style.width;
    flipCanvas.style.height = canvas.style.height;
    flipCanvas.getContext('2d').drawImage(canvas, 0, 0);

    flipOverlay.classList.remove('flip-next', 'flip-prev', 'flip-animate');
    flipOverlay.classList.add(direction === 'next' ? 'flip-next' : 'flip-prev');
    flipOverlay.style.visibility = 'visible';

    await renderPage(canvas, targetPage);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => flipOverlay.classList.add('flip-animate'));
    });

    flipOverlay.addEventListener('transitionend', function onDone() {
        flipOverlay.removeEventListener('transitionend', onDone);
        flipOverlay.classList.remove('flip-animate', 'flip-next', 'flip-prev');
        flipOverlay.style.visibility = 'hidden';
        currentPage = targetPage;
        updateControls();
        isFlipping = false;
    }, { once: true });
}

prevBtn.addEventListener('click', () => flipTo(currentPage - 1, 'prev'));
nextBtn.addEventListener('click', () => flipTo(currentPage + 1, 'next'));
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') flipTo(currentPage + 1, 'next');
    if (e.key === 'ArrowLeft')  flipTo(currentPage - 1, 'prev');
});

(async function init() {
    try {
        pdfDoc = await pdfjsLib.getDocument({ url: PDF_PATH }).promise;
        bookFrame.classList.remove('is-empty');
        await renderPage(canvas, currentPage);
        updateControls();
    } catch (err) {
        bookFrame.classList.add('is-empty');
        console.info('Rules PDF not loaded yet:', err?.message || err);
    }
})();

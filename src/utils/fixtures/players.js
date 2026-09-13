/**
 * Turning organiser input into player records.
 *
 * Names arrive three ways: typed one by one, pasted as a block, or read out of
 * a photo of the entry sheet. All three end up in the same shape:
 *
 *   { id, name, club }
 */

let counter = 0;

export function makePlayer(name, club = '') {
    counter += 1;
    return {
        id: 'p' + Date.now().toString(36) + '-' + counter.toString(36),
        name: String(name || '').trim(),
        club: String(club || '').trim(),
    };
}

/** Leading list markers an entry sheet or OCR pass tends to carry. */
const LEADING_MARKER = /^\s*(?:[-*•●▪]|\(?\d{1,3}[.)\]]|#\d{1,3})\s+/;
const SEPARATORS = [/\s*\|\s*/, /\s*[;,]\s*/, /\s*\t+\s*/, /\s+[-–—]\s+/];

/**
 * Parse a pasted or scanned block into players.
 * One player per line; the club may follow a comma, dash, pipe, tab, or sit in
 * brackets: "Arun Kumar, LASA" / "Arun Kumar - LASA" / "Arun Kumar (LASA)".
 */
export function parsePlayerList(text) {
    return String(text || '')
        .split(/\r?\n/)
        .map((line) => line.replace(LEADING_MARKER, '').trim())
        .filter((line) => line.length > 0)
        .map((line) => {
            const bracketed = line.match(/^(.*?)[([{]([^)\]}]+)[)\]}]\s*$/);
            if (bracketed) {
                return makePlayer(bracketed[1], bracketed[2]);
            }
            for (let i = 0; i < SEPARATORS.length; i += 1) {
                const parts = line.split(SEPARATORS[i]);
                if (parts.length >= 2 && parts[0].trim()) {
                    return makePlayer(parts[0], parts.slice(1).join(' ').trim());
                }
            }
            return makePlayer(line, '');
        })
        .filter((player) => player.name.length > 0);
}

/** Players back to the editable text form, so a draw can be tweaked and re-run. */
export function playersToText(players = []) {
    return players
        .map((player) => (player.club ? player.name + ', ' + player.club : player.name))
        .join('\n');
}

/** Names that appear more than once - usually an OCR slip worth flagging. */
export function findDuplicates(players = []) {
    const seen = new Map();
    const duplicates = [];
    players.forEach((player) => {
        const key = player.name.trim().toLowerCase();
        if (!key) return;
        if (seen.has(key)) {
            if (!duplicates.includes(player.name)) duplicates.push(player.name);
        } else {
            seen.set(key, true);
        }
    });
    return duplicates;
}

/* ------------------------------------------------------------------ *
 * Reading a photo of the entry list
 * ------------------------------------------------------------------ */

const TESSERACT_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.4/dist/tesseract.min.js';

let tesseractLoader = null;

/** Load the OCR library on first use only - it is never part of the bundle. */
function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (tesseractLoader) return tesseractLoader;

    tesseractLoader = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = TESSERACT_CDN;
        script.async = true;
        script.onload = () => {
            if (window.Tesseract) resolve(window.Tesseract);
            else reject(new Error('OCR library loaded but did not register.'));
        };
        script.onerror = () => {
            tesseractLoader = null;
            reject(new Error('Could not load the OCR library - check the internet connection.'));
        };
        document.body.appendChild(script);
    });

    return tesseractLoader;
}

/**
 * Read the text out of a photo of the entry list.
 * The result always goes into an editable box first: OCR gets handwriting and
 * unusual spellings wrong, and a draw must never run on an unchecked name.
 */
export async function recognizeImageText(file, onProgress) {
    const Tesseract = await loadTesseract();
    const { data } = await Tesseract.recognize(file, 'eng', {
        logger: (message) => {
            if (onProgress && message.status === 'recognizing text') {
                onProgress(Math.round((message.progress || 0) * 100));
            }
        },
    });
    return data.text || '';
}

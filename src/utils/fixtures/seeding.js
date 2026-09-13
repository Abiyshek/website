/**
 * Knockout seeding engine.
 *
 * The bracket is never hard-coded. Seed positions are generated recursively so
 * the same code produces a correct draw for 4, 8, 16, 32, 64, 128 ... players:
 *
 *   order(2)  = [1, 2]
 *   order(2n) = for every seed s in order(n) -> [s, 2n + 1 - s]
 *
 * That guarantees the traditional properties:
 *   - #1 and #2 sit in opposite halves and can only meet in the final
 *   - #1..#4 sit in different quarters, #1..#8 in different eighths
 *   - the strongest seeds receive the byes when the field is not a power of two
 */

/** Smallest power of two that can hold `n` entrants (minimum 2). */
export function nextPowerOfTwo(n) {
    let size = 2;
    while (size < n) size *= 2;
    return size;
}

/**
 * Seed numbers in bracket-position order for a bracket of `size` slots.
 * Position 0 plays position 1, position 2 plays position 3, and so on.
 */
export function seedOrder(size) {
    if (size < 2 || (size & (size - 1)) !== 0) {
        throw new Error('seedOrder() needs a power of two, received ' + size);
    }
    let order = [1];
    while (order.length < size) {
        const n = order.length * 2;
        const next = [];
        for (let i = 0; i < order.length; i += 1) {
            next.push(order[i], n + 1 - order[i]);
        }
        order = next;
    }
    return order;
}

/** The first-round seed pairings for a bracket of `size` slots. */
export function seedPairings(size) {
    const order = seedOrder(size);
    const pairs = [];
    for (let i = 0; i < order.length; i += 2) {
        pairs.push([order[i], order[i + 1]]);
    }
    return pairs;
}

/** Human name of a round, given how many players are still in it. */
export function roundName(playersLeft) {
    switch (playersLeft) {
        case 2:
            return 'Final';
        case 4:
            return 'Semi-Final';
        case 8:
            return 'Quarter-Final';
        default:
            return 'Round of ' + playersLeft;
    }
}

/* ------------------------------------------------------------------ *
 * Reproducible randomness
 * ------------------------------------------------------------------ */

/** Deterministic PRNG so a published draw can be re-verified from its seed. */
export function mulberry32(seed) {
    let a = seed >>> 0;
    return function rng() {
        a += 0x6d2b79f5;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function randomDrawSeed() {
    return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

/** Fisher-Yates using the supplied rng. Returns a new array. */
export function shuffle(list, rng) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = out[i];
        out[i] = out[j];
        out[j] = tmp;
    }
    return out;
}

/* ------------------------------------------------------------------ *
 * Draw restrictions
 * ------------------------------------------------------------------ */

const norm = (value) => String(value || '').trim().toLowerCase();

/**
 * Why two players must not meet in the first round, or null when they may.
 * Players carry an optional `club` and, when they came out of a league stage,
 * a `groupId`.
 */
export function clashReason(a, b, options = {}) {
    if (!a || !b) return null;
    if (options.avoidSameClub !== false && norm(a.club) && norm(a.club) === norm(b.club)) {
        return 'same club (' + a.club + ')';
    }
    if (options.avoidSameGroup && a.groupId && a.groupId === b.groupId) {
        return 'same group (' + a.groupId + ')';
    }
    return null;
}

/* ------------------------------------------------------------------ *
 * The draw
 * ------------------------------------------------------------------ */

/**
 * Build a seeded knockout draw.
 *
 * ranked    Ranked players in ranking order (index 0 = #1).
 * unranked  Unranked players; drawn randomly into whatever is left.
 * options   avoidSameClub  - keep club-mates apart in round 1 (default true)
 *           avoidSameGroup - keep group-mates apart (league -> knockout)
 *           drawSeed       - integer; reuse it to reproduce an identical draw
 *
 * Only players that share a `swapClass` are ever exchanged while resolving a
 * clash, so protected seeds never drift out of their seeded position: unranked
 * players swap with unranked players, and league qualifiers swap only with
 * other qualifiers that finished in the same group position.
 */
export function generateKnockoutDraw({ ranked = [], unranked = [], options = {} } = {}) {
    const {
        avoidSameClub = true,
        avoidSameGroup = false,
        drawSeed = randomDrawSeed(),
    } = options;

    const rng = mulberry32(drawSeed);
    const restrictions = { avoidSameClub, avoidSameGroup };

    const seededEntrants = ranked.map((player, index) => ({
        ...player,
        seed: index + 1,
        ranked: true,
        swapClass: player.swapClass || null,
    }));
    const drawnEntrants = shuffle(unranked, rng).map((player) => ({
        ...player,
        ranked: false,
        swapClass: player.swapClass || 'unranked',
    }));

    const entrants = seededEntrants.concat(drawnEntrants);
    const total = entrants.length;
    if (total < 2) {
        throw new Error('A knockout draw needs at least 2 players.');
    }

    const bracketSize = nextPowerOfTwo(total);
    const byes = bracketSize - total;

    // seat[s] holds the player carrying seed number s (1-based); null = BYE.
    const seat = new Array(bracketSize + 1).fill(null);
    entrants.forEach((player, index) => {
        seat[index + 1] = { ...player, seedNo: index + 1 };
    });

    const pairings = seedPairings(bracketSize);
    const warnings = [];
    let swaps = 0;

    if (avoidSameClub || avoidSameGroup) {
        const result = resolveClashes(seat, pairings, restrictions, rng);
        swaps = result.swaps;
        result.unresolved.forEach((clash) => warnings.push(clash));
    }

    const rounds = buildRounds(seat, pairings, bracketSize);

    return {
        drawSeed,
        bracketSize,
        byes,
        totalPlayers: total,
        rankedCount: seededEntrants.length,
        unrankedCount: drawnEntrants.length,
        restrictions,
        swaps,
        warnings,
        seats: seat,
        rounds,
    };
}

/**
 * Repair first-round clashes by exchanging interchangeable players.
 * Returns the number of swaps made and any clash that could not be resolved.
 */
function resolveClashes(seat, pairings, restrictions, rng) {
    const matchOfSeed = new Map();
    pairings.forEach((pair, index) => {
        matchOfSeed.set(pair[0], index);
        matchOfSeed.set(pair[1], index);
    });

    const clashOf = (matchIndex) => {
        const pair = pairings[matchIndex];
        return clashReason(seat[pair[0]], seat[pair[1]], restrictions);
    };

    const allSeeds = [];
    for (let s = 1; s < seat.length; s += 1) allSeeds.push(s);

    let swaps = 0;
    const maxPasses = pairings.length * 4 + 20;

    for (let pass = 0; pass < maxPasses; pass += 1) {
        const conflicted = [];
        for (let m = 0; m < pairings.length; m += 1) {
            if (clashOf(m)) conflicted.push(m);
        }
        if (conflicted.length === 0) break;

        let repaired = false;
        for (let c = 0; c < conflicted.length && !repaired; c += 1) {
            const matchIndex = conflicted[c];
            const movable = shuffle(
                pairings[matchIndex].filter((s) => seat[s] && seat[s].swapClass),
                rng,
            );

            for (let i = 0; i < movable.length && !repaired; i += 1) {
                const fromSeed = movable[i];
                const cls = seat[fromSeed].swapClass;
                const candidates = shuffle(
                    allSeeds.filter((s) => s !== fromSeed
                        && seat[s]
                        && seat[s].swapClass === cls
                        && matchOfSeed.get(s) !== matchIndex),
                    rng,
                );

                for (let j = 0; j < candidates.length; j += 1) {
                    const toSeed = candidates[j];
                    const otherMatch = matchOfSeed.get(toSeed);

                    const moved = seat[fromSeed];
                    seat[fromSeed] = seat[toSeed];
                    seat[toSeed] = moved;

                    if (!clashOf(matchIndex) && !clashOf(otherMatch)) {
                        swaps += 1;
                        repaired = true;
                        break;
                    }

                    const back = seat[fromSeed];
                    seat[fromSeed] = seat[toSeed];
                    seat[toSeed] = back;
                }
            }
        }
        if (!repaired) break; // nothing further can be improved
    }

    const unresolved = [];
    for (let m = 0; m < pairings.length; m += 1) {
        const reason = clashOf(m);
        if (reason) {
            const pair = pairings[m];
            unresolved.push(
                'Match ' + (m + 1) + ': ' + seat[pair[0]].name + ' vs ' + seat[pair[1]].name
                + ' - ' + reason + '. No legal swap was available, so this pairing had to stand.',
            );
        }
    }

    return { swaps, unresolved };
}

/** Turn a filled bracket into rounds of matches, auto-advancing byes. */
function buildRounds(seat, pairings, bracketSize) {
    const rounds = [];
    const firstRound = pairings.map((pair, index) => {
        const a = seat[pair[0]] || null;
        const b = seat[pair[1]] || null;
        const isBye = !a || !b;
        return {
            id: 'R1M' + (index + 1),
            round: 1,
            index,
            a,
            b,
            seedA: pair[0],
            seedB: pair[1],
            isBye,
            winner: isBye ? a || b : null,
            feedA: null,
            feedB: null,
        };
    });
    rounds.push({ round: 1, name: roundName(bracketSize), matches: firstRound });

    let previous = firstRound;
    let playersLeft = bracketSize / 2;
    let roundNo = 2;
    while (playersLeft >= 2) {
        const matches = [];
        for (let i = 0; i < previous.length; i += 2) {
            const feedA = previous[i];
            const feedB = previous[i + 1];
            matches.push({
                id: 'R' + roundNo + 'M' + (matches.length + 1),
                round: roundNo,
                index: matches.length,
                a: feedA.winner || null,
                b: feedB.winner || null,
                isBye: false,
                winner: null,
                feedA: feedA.id,
                feedB: feedB.id,
            });
        }
        rounds.push({ round: roundNo, name: roundName(playersLeft), matches });
        previous = matches;
        playersLeft /= 2;
        roundNo += 1;
    }

    return rounds;
}

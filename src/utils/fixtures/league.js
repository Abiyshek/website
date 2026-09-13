/**
 * League (group stage) engine: group formation, round-robin fixtures,
 * standings with tie-breakers, and the hand-off into the knockout bracket.
 */

import { shuffle, mulberry32, randomDrawSeed, generateKnockoutDraw } from './seeding';

export const GROUP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const norm = (value) => String(value || '').trim().toLowerCase();

export const DEFAULT_POINTS = { win: 3, draw: 1, loss: 0 };

/** Group sizes that differ by at most one, largest groups first. */
export function groupSizes(total, groupCount) {
    const base = Math.floor(total / groupCount);
    const remainder = total % groupCount;
    const sizes = [];
    for (let i = 0; i < groupCount; i += 1) {
        sizes.push(base + (i < remainder ? 1 : 0));
    }
    return sizes;
}

/**
 * Build the groups.
 *
 * Ranked players are spread by serpentine (snake) seeding - A B C D, then
 * D C B A, then A B C D again - so no group collects all the strength.
 * Unranked players are then drawn at random into the seats that are left,
 * preferring a group that does not already hold a player from their club.
 */
export function buildGroups({ ranked = [], unranked = [], groupCount = 4, options = {} } = {}) {
    const { avoidSameClub = true, drawSeed = randomDrawSeed() } = options;
    const rng = mulberry32(drawSeed);

    const total = ranked.length + unranked.length;
    if (groupCount < 1) throw new Error('A league needs at least one group.');
    if (total < groupCount * 2) {
        throw new Error('Not enough players: every group needs at least 2 players.');
    }

    const sizes = groupSizes(total, groupCount);
    const groups = sizes.map((size, index) => ({
        id: GROUP_LETTERS[index] || 'G' + (index + 1),
        name: 'Group ' + (GROUP_LETTERS[index] || index + 1),
        capacity: size,
        players: [],
    }));

    const warnings = [];

    // 1. Serpentine distribution of the ranked players.
    let direction = 1;
    let cursor = 0;
    ranked.forEach((player, index) => {
        let placed = false;
        for (let attempt = 0; attempt < groupCount && !placed; attempt += 1) {
            const group = groups[cursor];
            if (group.players.length < group.capacity) {
                group.players.push({ ...player, rank: index + 1, ranked: true, groupId: group.id });
                placed = true;
            }
            cursor += direction;
            if (cursor >= groupCount) {
                cursor = groupCount - 1;
                direction = -1;
            } else if (cursor < 0) {
                cursor = 0;
                direction = 1;
            }
        }
        if (!placed) {
            warnings.push('No seat left for ranked player ' + player.name + '.');
        }
    });

    // 2. Random draw of the unranked players into the remaining seats.
    const drawn = shuffle(unranked, rng);
    drawn.forEach((player) => {
        const open = groups.filter((g) => g.players.length < g.capacity);
        if (open.length === 0) {
            warnings.push('No seat left for ' + player.name + '.');
            return;
        }
        const emptiest = Math.min(...open.map((g) => g.players.length));
        const candidates = open.filter((g) => g.players.length === emptiest);
        const clubFree = avoidSameClub && norm(player.club)
            ? candidates.filter((g) => !g.players.some((p) => norm(p.club) === norm(player.club)))
            : candidates;

        let pool = clubFree.length ? clubFree : candidates;
        if (avoidSameClub && norm(player.club) && clubFree.length === 0) {
            const anyClubFree = open.filter(
                (g) => !g.players.some((p) => norm(p.club) === norm(player.club)),
            );
            if (anyClubFree.length) {
                pool = anyClubFree;
            } else {
                warnings.push(
                    player.name + ' (' + player.club + ') had to join a group that already '
                    + 'holds a club-mate - every group did.',
                );
            }
        }

        const group = pool[Math.floor(rng() * pool.length)];
        group.players.push({ ...player, ranked: false, groupId: group.id });
    });

    return { groups, drawSeed, warnings, sizes };
}

/**
 * Round-robin fixtures for one group using the circle method, so each round
 * is a set of matches that can be played at the same time.
 */
export function roundRobinFixtures(group, { doubleRoundRobin = false } = {}) {
    const players = group.players.slice();
    const odd = players.length % 2 === 1;
    if (odd) players.push(null); // sit-out marker

    const n = players.length;
    const roundCount = n - 1;
    const rounds = [];

    let rotation = players.slice();
    for (let r = 0; r < roundCount; r += 1) {
        const matches = [];
        for (let i = 0; i < n / 2; i += 1) {
            const a = rotation[i];
            const b = rotation[n - 1 - i];
            if (!a || !b) continue; // the sit-out for this round
            const home = r % 2 === 0 ? a : b;
            const away = r % 2 === 0 ? b : a;
            matches.push({
                id: group.id + 'R' + (r + 1) + 'M' + (matches.length + 1),
                groupId: group.id,
                round: r + 1,
                leg: 1,
                a: home,
                b: away,
            });
        }
        rounds.push({ round: r + 1, leg: 1, matches });

        const fixed = rotation[0];
        const rest = rotation.slice(1);
        rest.unshift(rest.pop());
        rotation = [fixed].concat(rest);
    }

    if (doubleRoundRobin) {
        const second = rounds.map((round) => ({
            round: round.round + roundCount,
            leg: 2,
            matches: round.matches.map((m, index) => ({
                ...m,
                id: group.id + 'R' + (round.round + roundCount) + 'M' + (index + 1),
                round: round.round + roundCount,
                leg: 2,
                a: m.b,
                b: m.a,
            })),
        }));
        return rounds.concat(second);
    }

    return rounds;
}

/** All fixtures for every group, keyed by group id. */
export function buildLeagueFixtures(groups, options = {}) {
    const byGroup = {};
    groups.forEach((group) => {
        byGroup[group.id] = roundRobinFixtures(group, options);
    });
    return byGroup;
}

/** Matches in a group: n * (n-1) / 2, doubled for a two-leg league. */
export function matchCount(playerCount, doubleRoundRobin = false) {
    const single = (playerCount * (playerCount - 1)) / 2;
    return doubleRoundRobin ? single * 2 : single;
}

/* ------------------------------------------------------------------ *
 * Standings
 * ------------------------------------------------------------------ */

const emptyRow = (player) => ({
    id: player.id,
    player,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    for: 0,
    against: 0,
    diff: 0,
    points: 0,
});

const hasScore = (result) => result
    && result.scoreA !== '' && result.scoreB !== ''
    && result.scoreA !== null && result.scoreB !== null
    && !Number.isNaN(Number(result.scoreA)) && !Number.isNaN(Number(result.scoreB));

/**
 * Standings for one group.
 *
 * `results` is a map of matchId -> { scoreA, scoreB } holding games (or sets,
 * or goals - whatever the sport counts) won by each side.
 */
export function computeStandings(group, results = {}, points = DEFAULT_POINTS) {
    const rows = new Map();
    group.players.forEach((player) => rows.set(player.id, emptyRow(player)));

    const played = [];

    Object.keys(results).forEach((matchId) => {
        const result = results[matchId];
        if (!result || result.groupId !== group.id || !hasScore(result)) return;
        const rowA = rows.get(result.aId);
        const rowB = rows.get(result.bId);
        if (!rowA || !rowB) return;

        const scoreA = Number(result.scoreA);
        const scoreB = Number(result.scoreB);

        rowA.played += 1;
        rowB.played += 1;
        rowA.for += scoreA;
        rowA.against += scoreB;
        rowB.for += scoreB;
        rowB.against += scoreA;

        if (scoreA > scoreB) {
            rowA.won += 1;
            rowB.lost += 1;
            rowA.points += points.win;
            rowB.points += points.loss;
        } else if (scoreB > scoreA) {
            rowB.won += 1;
            rowA.lost += 1;
            rowB.points += points.win;
            rowA.points += points.loss;
        } else {
            rowA.drawn += 1;
            rowB.drawn += 1;
            rowA.points += points.draw;
            rowB.points += points.draw;
        }

        played.push({ aId: result.aId, bId: result.bId, scoreA, scoreB });
    });

    const table = Array.from(rows.values());
    table.forEach((row) => {
        row.diff = row.for - row.against;
    });

    const sorted = sortWithTiebreaks(table, played, points);
    sorted.forEach((row, index) => {
        row.position = index + 1;
    });
    return sorted;
}

/**
 * Points, then the head-to-head mini-league between the tied players, then
 * overall difference, then overall games scored, then name.
 */
export function sortWithTiebreaks(rows, played, points = DEFAULT_POINTS) {
    const byPoints = rows.slice().sort((a, b) => b.points - a.points);
    const out = [];
    let i = 0;

    while (i < byPoints.length) {
        let j = i;
        while (j + 1 < byPoints.length && byPoints[j + 1].points === byPoints[i].points) j += 1;
        const tied = byPoints.slice(i, j + 1);

        if (tied.length === 1) {
            out.push(tied[0]);
        } else {
            const ids = new Set(tied.map((row) => row.id));
            const mini = new Map();
            tied.forEach((row) => mini.set(row.id, { points: 0, for: 0, against: 0 }));

            played.forEach((match) => {
                if (!ids.has(match.aId) || !ids.has(match.bId)) return;
                const a = mini.get(match.aId);
                const b = mini.get(match.bId);
                a.for += match.scoreA;
                a.against += match.scoreB;
                b.for += match.scoreB;
                b.against += match.scoreA;
                if (match.scoreA > match.scoreB) {
                    a.points += points.win;
                    b.points += points.loss;
                } else if (match.scoreB > match.scoreA) {
                    b.points += points.win;
                    a.points += points.loss;
                } else {
                    a.points += points.draw;
                    b.points += points.draw;
                }
            });

            tied.sort((x, y) => {
                const mx = mini.get(x.id);
                const my = mini.get(y.id);
                return (my.points - mx.points)
                    || ((my.for - my.against) - (mx.for - mx.against))
                    || (my.for - mx.for)
                    || (y.diff - x.diff)
                    || (y.for - x.for)
                    || String(x.player.name).localeCompare(String(y.player.name));
            });
            tied.forEach((row) => out.push(row));
        }
        i = j + 1;
    }

    return out;
}

/** True once every group has a complete set of results. */
export function isLeagueComplete(groups, fixturesByGroup, results) {
    return groups.every((group) => (fixturesByGroup[group.id] || []).every(
        (round) => round.matches.every((match) => hasScore(results[match.id])),
    ));
}

/* ------------------------------------------------------------------ *
 * League -> knockout
 * ------------------------------------------------------------------ */

/**
 * Take the top `qualifiersPerGroup` from every group and rank them globally:
 * all group winners first (best winner = seed 1), then all runners-up, and so
 * on, each block ordered by points, difference and games scored.
 */
export function selectQualifiers(groups, standingsByGroup, qualifiersPerGroup) {
    const blocks = [];
    for (let position = 1; position <= qualifiersPerGroup; position += 1) {
        const block = [];
        groups.forEach((group) => {
            const row = (standingsByGroup[group.id] || [])[position - 1];
            if (row) block.push({ ...row, groupId: group.id, groupPosition: position });
        });
        block.sort((a, b) => (b.points - a.points)
            || (b.diff - a.diff)
            || (b.for - a.for)
            || String(a.player.name).localeCompare(String(b.player.name)));
        blocks.push(block);
    }

    const qualifiers = [];
    blocks.forEach((block) => block.forEach((row) => qualifiers.push(row)));

    return qualifiers.map((row, index) => ({
        ...row.player,
        groupId: row.groupId,
        groupPosition: row.groupPosition,
        label: row.groupId + String(row.groupPosition),
        seed: index + 1,
        // Only qualifiers that finished in the same group position may be
        // exchanged when a same-group or same-club clash has to be repaired.
        swapClass: 'pos' + row.groupPosition,
    }));
}

/**
 * Seed the qualifiers into a knockout bracket. Players who came out of the
 * same group (and, optionally, the same club) are kept apart in round one.
 */
export function knockoutFromLeague(qualifiers, options = {}) {
    return generateKnockoutDraw({
        ranked: qualifiers,
        unranked: [],
        options: {
            avoidSameGroup: true,
            avoidSameClub: options.avoidSameClub !== false,
            drawSeed: options.drawSeed,
        },
    });
}

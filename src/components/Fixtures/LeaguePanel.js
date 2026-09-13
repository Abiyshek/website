import React, { useContext, useMemo, useState } from 'react';
import {
    Button, TextField, FormControlLabel, Checkbox, Snackbar, MenuItem,
} from '@material-ui/core';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import PrintIcon from '@material-ui/icons/Print';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GetAppIcon from '@material-ui/icons/GetApp';

import { ThemeContext } from '../../contexts/ThemeContext';
import {
    buildGroups, buildLeagueFixtures, computeStandings, selectQualifiers,
    knockoutFromLeague, isLeagueComplete, randomDrawSeed, matchCount, nextPowerOfTwo,
    roundName,
} from '../../utils/fixtures';
import BracketView from './BracketView';
import { drawToText, leagueToText, copyToClipboard, downloadFile } from './exporters';

/** League stage -> qualification -> knockout. */
export default function LeaguePanel({
    ranked, unranked, league, setLeague, results, setResults,
    options, setOptions, koDraw, setKoDraw,
}) {
    const { theme } = useContext(ThemeContext);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');

    const total = ranked.length + unranked.length;
    const points = options.points;

    const standings = useMemo(() => {
        if (!league) return {};
        const table = {};
        league.groups.forEach((group) => {
            table[group.id] = computeStandings(group, results, points);
        });
        return table;
    }, [league, results, points]);

    const qualifierCount = league
        ? league.groups.length * Math.min(options.qualifiersPerGroup, Math.min(
            ...league.groups.map((g) => g.players.length),
        ))
        : 0;

    const drawGroups = () => {
        setError('');
        try {
            const drawSeed = randomDrawSeed();
            const built = buildGroups({
                ranked,
                unranked,
                groupCount: Number(options.groupCount),
                options: { avoidSameClub: options.avoidSameClub, drawSeed },
            });
            const fixtures = buildLeagueFixtures(built.groups, {
                doubleRoundRobin: options.doubleRoundRobin,
            });
            setLeague({ ...built, fixtures });
            setResults({});
            setKoDraw(null);
        } catch (e) {
            setError(e.message);
        }
    };

    const setScore = (match, side, value) => {
        const previous = results[match.id] || {
            groupId: match.groupId, aId: match.a.id, bId: match.b.id, scoreA: '', scoreB: '',
        };
        setResults({
            ...results,
            [match.id]: { ...previous, [side]: value },
        });
    };

    const seedKnockout = () => {
        setError('');
        try {
            const qualifiers = selectQualifiers(
                league.groups, standings, Number(options.qualifiersPerGroup),
            );
            setKoDraw(knockoutFromLeague(qualifiers, {
                avoidSameClub: options.avoidSameClub,
                drawSeed: randomDrawSeed(),
            }));
        } catch (e) {
            setError(e.message);
        }
    };

    const complete = league ? isLeagueComplete(league.groups, league.fixtures, results) : false;

    return (
        <div>
            <div className='fx-card fx-no-print'>
                <h2 className='fx-section-title'>League stage</h2>
                <p className='fx-hint'>
                    The ranked players are spread across the groups by serpentine seeding -
                    A B C D, then D C B A - so no group collects all the strength. Everyone else
                    is drawn at random into the seats that are left, avoiding a group that already
                    holds a club-mate wherever possible.
                </p>

                <div className='fx-grid-2'>
                    <TextField
                        select
                        variant='outlined'
                        size='small'
                        label='Number of groups'
                        value={options.groupCount}
                        onChange={(e) => setOptions({ ...options, groupCount: e.target.value })}
                    >
                        {[2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((n) => (
                            <MenuItem key={n} value={n} disabled={total < n * 2}>
                                {n} groups
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        variant='outlined'
                        size='small'
                        label='Qualifiers per group'
                        value={options.qualifiersPerGroup}
                        onChange={(e) => setOptions({ ...options, qualifiersPerGroup: e.target.value })}
                    >
                        {[1, 2, 3, 4].map((n) => (
                            <MenuItem key={n} value={n}>{n} per group</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        variant='outlined'
                        size='small'
                        type='number'
                        label='Points for a win'
                        value={points.win}
                        onChange={(e) => setOptions({
                            ...options, points: { ...points, win: Number(e.target.value) },
                        })}
                    />
                    <TextField
                        variant='outlined'
                        size='small'
                        type='number'
                        label='Points for a draw'
                        value={points.draw}
                        onChange={(e) => setOptions({
                            ...options, points: { ...points, draw: Number(e.target.value) },
                        })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={options.avoidSameClub}
                                onChange={(e) => setOptions({ ...options, avoidSameClub: e.target.checked })}
                                color='primary'
                            />
                        )}
                        label='Keep club-mates in different groups'
                    />
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={options.doubleRoundRobin}
                                onChange={(e) => setOptions({ ...options, doubleRoundRobin: e.target.checked })}
                                color='primary'
                            />
                        )}
                        label='Play every pairing twice (home and away)'
                    />
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <Button
                        variant='contained'
                        color='primary'
                        startIcon={<GroupWorkIcon />}
                        onClick={drawGroups}
                        disabled={total < Number(options.groupCount) * 2}
                    >
                        Draw the groups
                    </Button>
                </div>

                {total < Number(options.groupCount) * 2 && (
                    <div className='fx-note warn'>
                        {Number(options.groupCount)} groups need at least{' '}
                        {Number(options.groupCount) * 2} players - there are {total}.
                    </div>
                )}
                {error && <div className='fx-note error'>{error}</div>}

                {total > 0 && (
                    <div className='fx-note'>
                        {total} players in {options.groupCount} groups, top{' '}
                        {options.qualifiersPerGroup} through ={' '}
                        {Number(options.groupCount) * Number(options.qualifiersPerGroup)} knockout
                        players, which is a{' '}
                        {roundName(nextPowerOfTwo(
                            Number(options.groupCount) * Number(options.qualifiersPerGroup),
                        ))}.
                    </div>
                )}
            </div>

            {league && (
                <div className='fx-card'>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                    }}>
                        <h2 className='fx-section-title'>
                            {league.groups.length} groups - draw seed {league.drawSeed}
                        </h2>
                        <div className='fx-no-print' style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Button
                                size='small'
                                startIcon={<FileCopyIcon />}
                                onClick={() => copyToClipboard(
                                    leagueToText(league.groups, league.fixtures, standings),
                                ).then(() => setToast('League copied as text'))
                                    .catch(() => setToast('Could not copy - clipboard access was blocked'))}
                            >
                                Copy
                            </Button>
                            <Button
                                size='small'
                                startIcon={<GetAppIcon />}
                                onClick={() => downloadFile('league-stage.json', JSON.stringify({
                                    groups: league.groups,
                                    fixtures: league.fixtures,
                                    results,
                                    standings,
                                }, null, 2))}
                            >
                                JSON
                            </Button>
                            <Button size='small' startIcon={<PrintIcon />} onClick={() => window.print()}>
                                Print
                            </Button>
                        </div>
                    </div>

                    {league.warnings.map((warning) => (
                        <div className='fx-note warn' key={warning}>{warning}</div>
                    ))}

                    <div className='fx-grid-2' style={{ marginTop: '1rem' }}>
                        {league.groups.map((group) => (
                            <div className='fx-group-card' key={group.id}>
                                <div className='fx-group-head' style={{ background: theme.primary }}>
                                    {group.name} - {group.players.length} players -{' '}
                                    {matchCount(group.players.length, options.doubleRoundRobin)} matches
                                </div>
                                <table className='fx-table'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Player</th>
                                            <th>Club</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.players.map((player, index) => (
                                            <tr key={player.id}>
                                                <td className='fx-num'>
                                                    {player.ranked ? '#' + player.rank : index + 1}
                                                </td>
                                                <td style={{ fontWeight: player.ranked ? 700 : 400 }}>
                                                    {player.name}
                                                </td>
                                                <td>{player.club}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {league && (
                <div className='fx-card'>
                    <h2 className='fx-section-title'>Group fixtures and results</h2>
                    <p className='fx-hint'>
                        Every player meets every other player in the group. Enter games (or sets,
                        or points - whatever this event counts) as results come in; the tables
                        below update as you type.
                    </p>

                    <div className='fx-grid-2'>
                        {league.groups.map((group) => (
                            <div key={group.id}>
                                <div className='fx-group-head' style={{
                                    background: theme.primary, borderRadius: '8px 8px 0 0',
                                }}>
                                    {group.name}
                                </div>
                                <div style={{ border: '1px solid #e2e7f0', borderTop: 0, padding: '0.75rem' }}>
                                    {(league.fixtures[group.id] || []).map((round) => (
                                        <div key={group.id + '-r' + round.round} style={{ marginBottom: '0.9rem' }}>
                                            <div className='fx-stat-label'>
                                                Round {round.round}{round.leg === 2 ? ' (return)' : ''}
                                            </div>
                                            {round.matches.map((match) => {
                                                const result = results[match.id] || {};
                                                return (
                                                    <div className='fx-fixture-row' key={match.id}>
                                                        <span className='fx-fixture-side'>{match.a.name}</span>
                                                        <TextField
                                                            className='fx-score-input'
                                                            size='small'
                                                            type='number'
                                                            inputProps={{ min: 0, style: { textAlign: 'center', padding: '4px' } }}
                                                            value={result.scoreA === undefined ? '' : result.scoreA}
                                                            onChange={(e) => setScore(match, 'scoreA', e.target.value)}
                                                        />
                                                        <TextField
                                                            className='fx-score-input'
                                                            size='small'
                                                            type='number'
                                                            inputProps={{ min: 0, style: { textAlign: 'center', padding: '4px' } }}
                                                            value={result.scoreB === undefined ? '' : result.scoreB}
                                                            onChange={(e) => setScore(match, 'scoreB', e.target.value)}
                                                        />
                                                        <span className='fx-fixture-side right'>{match.b.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {league && (
                <div className='fx-card'>
                    <h2 className='fx-section-title'>Standings</h2>
                    <p className='fx-hint'>
                        Ordered by points, then the head-to-head result between the tied players,
                        then difference, then games scored. The top {options.qualifiersPerGroup} in
                        each group are shaded - they are the ones who go through.
                    </p>

                    <div className='fx-grid-2'>
                        {league.groups.map((group) => (
                            <div className='fx-group-card' key={'st-' + group.id}>
                                <div className='fx-group-head' style={{ background: theme.primary }}>
                                    {group.name}
                                </div>
                                <table className='fx-table'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Player</th>
                                            <th className='fx-num'>P</th>
                                            <th className='fx-num'>W</th>
                                            <th className='fx-num'>D</th>
                                            <th className='fx-num'>L</th>
                                            <th className='fx-num'>F</th>
                                            <th className='fx-num'>A</th>
                                            <th className='fx-num'>+/-</th>
                                            <th className='fx-num'>Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(standings[group.id] || []).map((row) => (
                                            <tr
                                                key={row.id}
                                                className={row.position <= options.qualifiersPerGroup ? 'qualified' : ''}
                                            >
                                                <td className='fx-num'>{row.position}</td>
                                                <td>{row.player.name}</td>
                                                <td className='fx-num'>{row.played}</td>
                                                <td className='fx-num'>{row.won}</td>
                                                <td className='fx-num'>{row.drawn}</td>
                                                <td className='fx-num'>{row.lost}</td>
                                                <td className='fx-num'>{row.for}</td>
                                                <td className='fx-num'>{row.against}</td>
                                                <td className='fx-num'>{row.diff > 0 ? '+' + row.diff : row.diff}</td>
                                                <td className='fx-num'><strong>{row.points}</strong></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>

                    <div className='fx-no-print' style={{ marginTop: '1.5rem' }}>
                        {!complete && (
                            <div className='fx-note warn'>
                                Some group matches have no result yet. The knockout can still be
                                seeded from the table as it stands, but the seeding will change
                                once the remaining results are in.
                            </div>
                        )}
                        <Button
                            variant='contained'
                            color='primary'
                            startIcon={<EmojiEventsIcon />}
                            onClick={seedKnockout}
                            disabled={qualifierCount < 2}
                        >
                            Seed the knockout from these standings
                        </Button>
                    </div>
                </div>
            )}

            {koDraw && (
                <div className='fx-card'>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem',
                    }}>
                        <div>
                            <h2 className='fx-section-title'>
                                Knockout stage - {koDraw.rounds[0].name}
                            </h2>
                            <p className='fx-hint' style={{ marginBottom: 0 }}>
                                Group winners are seeded above the runners-up, and nobody meets a
                                player from their own group in the first round.
                            </p>
                        </div>
                        <div className='fx-no-print' style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                                size='small'
                                startIcon={<FileCopyIcon />}
                                onClick={() => copyToClipboard(drawToText(koDraw, 'KNOCKOUT STAGE'))
                                    .then(() => setToast('Knockout copied as text'))
                                    .catch(() => setToast('Could not copy - clipboard access was blocked'))}
                            >
                                Copy
                            </Button>
                            <Button size='small' startIcon={<PrintIcon />} onClick={() => window.print()}>
                                Print
                            </Button>
                        </div>
                    </div>

                    {koDraw.warnings.map((warning) => (
                        <div className='fx-note warn' key={warning}>{warning}</div>
                    ))}

                    <BracketView draw={koDraw} />
                </div>
            )}

            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={2500}
                onClose={() => setToast('')}
                message={toast}
            />
        </div>
    );
}

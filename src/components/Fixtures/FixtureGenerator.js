import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Tabs, Tab, Button } from '@material-ui/core';

import { ThemeContext } from '../../contexts/ThemeContext';
import { parsePlayerList } from '../../utils/fixtures';
import PlayerInput from './PlayerInput';
import KnockoutPanel from './KnockoutPanel';
import LeaguePanel from './LeaguePanel';
import './Fixtures.css';

const STORAGE_KEY = 'lasa-fixtures-v1';

const emptyRanked = () => Array.from({ length: 8 }, () => ({ name: '', club: '' }));

const defaultKnockoutOptions = { avoidSameClub: true, drawSeed: '' };

const defaultLeagueOptions = {
    groupCount: 4,
    qualifiersPerGroup: 2,
    doubleRoundRobin: false,
    avoidSameClub: true,
    points: { win: 3, draw: 1, loss: 0 },
};

function loadSaved() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

/**
 * The ballot / fixture generator: enter the field once, then produce either a
 * straight knockout draw or a league stage that feeds a knockout.
 *
 * Everything is worked out in the browser and kept in this browser's local
 * storage - nothing is uploaded, so an unfinished draw survives a refresh.
 */
export default function FixtureGenerator() {
    const { theme } = useContext(ThemeContext);
    const saved = useMemo(loadSaved, []);

    const [tab, setTab] = useState(0);
    const [rankedRows, setRankedRows] = useState(
        (saved && saved.rankedRows) || emptyRanked(),
    );
    const [unrankedText, setUnrankedText] = useState((saved && saved.unrankedText) || '');
    const [knockoutOptions, setKnockoutOptions] = useState(
        (saved && saved.knockoutOptions) || defaultKnockoutOptions,
    );
    const [leagueOptions, setLeagueOptions] = useState(
        (saved && saved.leagueOptions) || defaultLeagueOptions,
    );
    const [draw, setDraw] = useState((saved && saved.draw) || null);
    const [league, setLeague] = useState((saved && saved.league) || null);
    const [results, setResults] = useState((saved && saved.results) || {});
    const [koDraw, setKoDraw] = useState((saved && saved.koDraw) || null);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
                rankedRows, unrankedText, knockoutOptions, leagueOptions,
                draw, league, results, koDraw,
            }));
        } catch (error) {
            // Storage can be full or blocked; the generator still works without it.
        }
    }, [rankedRows, unrankedText, knockoutOptions, leagueOptions, draw, league, results, koDraw]);

    // Parsing is memoised so player ids stay stable between renders.
    const unranked = useMemo(() => parsePlayerList(unrankedText), [unrankedText]);
    const ranked = useMemo(() => rankedRows
        .map((row, index) => ({
            id: 'seed-' + (index + 1),
            name: row.name.trim(),
            club: row.club.trim(),
        }))
        .filter((player) => player.name), [rankedRows]);

    const resetAll = () => {
        setRankedRows(emptyRanked());
        setUnrankedText('');
        setKnockoutOptions(defaultKnockoutOptions);
        setLeagueOptions(defaultLeagueOptions);
        setDraw(null);
        setLeague(null);
        setResults({});
        setKoDraw(null);
    };

    return (
        <div className='fx-page' style={{ backgroundColor: '#f4f6fb' }}>
            <div className='fx-shell'>
                <div className='fx-card'>
                    <h1 className='fx-title' style={{ color: theme.primary }}>
                        Fixture &amp; Ballot Generator
                    </h1>
                    <p className='fx-subtitle'>
                        Enter the ranked players and the rest of the field once, then draw a
                        seeded knockout bracket, or a league stage whose qualifiers feed the
                        knockout. Club-mates are kept apart in the first round, byes go to the
                        top seeds, and every draw carries a seed number so it can be reproduced
                        and checked afterwards.
                    </p>

                    <Tabs
                        value={tab}
                        onChange={(event, value) => setTab(value)}
                        indicatorColor='primary'
                        textColor='primary'
                        variant='scrollable'
                        scrollButtons='auto'
                        className='fx-no-print'
                        style={{ borderBottom: '2px solid #e6eaf2' }}
                    >
                        <Tab label={'Players (' + (ranked.length + unranked.length) + ')'} />
                        <Tab label='Knockout draw' />
                        <Tab label='League + knockout' />
                    </Tabs>
                </div>

                {tab === 0 && (
                    <PlayerInput
                        rankedRows={rankedRows}
                        setRankedRows={setRankedRows}
                        unrankedText={unrankedText}
                        setUnrankedText={setUnrankedText}
                    />
                )}

                {tab === 1 && (
                    <KnockoutPanel
                        ranked={ranked}
                        unranked={unranked}
                        draw={draw}
                        setDraw={setDraw}
                        options={knockoutOptions}
                        setOptions={setKnockoutOptions}
                    />
                )}

                {tab === 2 && (
                    <LeaguePanel
                        ranked={ranked}
                        unranked={unranked}
                        league={league}
                        setLeague={setLeague}
                        results={results}
                        setResults={setResults}
                        options={leagueOptions}
                        setOptions={setLeagueOptions}
                        koDraw={koDraw}
                        setKoDraw={setKoDraw}
                    />
                )}

                <div className='fx-card fx-no-print' style={{ textAlign: 'center' }}>
                    <p className='fx-hint' style={{ marginBottom: '0.75rem' }}>
                        Everything on this page is stored only in this browser. Clearing it
                        removes the field, the draws and any results entered.
                    </p>
                    <Button variant='outlined' color='secondary' onClick={resetAll}>
                        Clear everything and start a new tournament
                    </Button>
                </div>
            </div>
        </div>
    );
}

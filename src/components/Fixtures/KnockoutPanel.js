import React, { useContext, useState } from 'react';
import {
    Button, TextField, FormControlLabel, Checkbox, Snackbar,
} from '@material-ui/core';
import CasinoIcon from '@material-ui/icons/Casino';
import PrintIcon from '@material-ui/icons/Print';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GetAppIcon from '@material-ui/icons/GetApp';

import { ThemeContext } from '../../contexts/ThemeContext';
import { generateKnockoutDraw, randomDrawSeed } from '../../utils/fixtures';
import BracketView from './BracketView';
import { drawToText, copyToClipboard, downloadFile } from './exporters';

/** Straight knockout: seeds protected, everyone else drawn at random. */
export default function KnockoutPanel({
    ranked, unranked, draw, setDraw, options, setOptions,
}) {
    const { theme } = useContext(ThemeContext);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');

    const total = ranked.length + unranked.length;

    const generate = (seed) => {
        setError('');
        try {
            const drawSeed = seed === undefined ? randomDrawSeed() : Number(seed);
            const result = generateKnockoutDraw({
                ranked,
                unranked,
                options: { ...options, drawSeed },
            });
            setDraw(result);
            setOptions({ ...options, drawSeed });
        } catch (e) {
            setError(e.message);
            setDraw(null);
        }
    };

    return (
        <div>
            <div className='fx-card fx-no-print'>
                <h2 className='fx-section-title'>Knockout draw</h2>
                <p className='fx-hint'>
                    Seed positions are worked out recursively, so the same rules produce the
                    bracket for 8, 16, 32, 64 or 128 players. The ranked players go into their
                    traditional positions, the byes go to the strongest seeds, and everyone else
                    is drawn at random into the seats that remain.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={options.avoidSameClub}
                                onChange={(e) => setOptions({ ...options, avoidSameClub: e.target.checked })}
                                color='primary'
                            />
                        )}
                        label='Keep club-mates apart in round 1'
                    />
                    <TextField
                        variant='outlined'
                        size='small'
                        label='Draw seed'
                        type='number'
                        value={options.drawSeed || ''}
                        onChange={(e) => setOptions({ ...options, drawSeed: e.target.value })}
                        helperText='Same seed = same draw, so a draw can be re-checked'
                        style={{ width: 220 }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <Button
                        variant='contained'
                        color='primary'
                        startIcon={<CasinoIcon />}
                        onClick={() => generate()}
                        disabled={total < 2}
                    >
                        Make the draw
                    </Button>
                    {draw && (
                        <Button
                            variant='outlined'
                            onClick={() => generate(options.drawSeed)}
                        >
                            Re-run this seed
                        </Button>
                    )}
                </div>

                {total < 2 && (
                    <div className='fx-note warn'>
                        Add at least two players on the Players tab before making a draw.
                    </div>
                )}
                {error && <div className='fx-note error'>{error}</div>}
            </div>

            {draw && (
                <div className='fx-card'>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem',
                    }}>
                        <div>
                            <h2 className='fx-section-title'>
                                {draw.rounds[0].name} - {draw.totalPlayers} players
                            </h2>
                            <p className='fx-hint' style={{ marginBottom: 0 }}>
                                Draw seed {draw.drawSeed}
                                {draw.swaps > 0 && ' - ' + draw.swaps + ' swap'
                                    + (draw.swaps > 1 ? 's' : '') + ' made to honour the draw rules'}
                            </p>
                        </div>
                        <div className='fx-no-print' style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Button
                                size='small'
                                startIcon={<FileCopyIcon />}
                                onClick={() => copyToClipboard(drawToText(draw))
                                    .then(() => setToast('Draw copied as text'))
                                    .catch(() => setToast('Could not copy - clipboard access was blocked'))}
                            >
                                Copy
                            </Button>
                            <Button
                                size='small'
                                startIcon={<GetAppIcon />}
                                onClick={() => downloadFile('knockout-draw.json', JSON.stringify(draw, null, 2))}
                            >
                                JSON
                            </Button>
                            <Button
                                size='small'
                                startIcon={<PrintIcon />}
                                onClick={() => window.print()}
                            >
                                Print
                            </Button>
                        </div>
                    </div>

                    <div className='fx-stats'>
                        <div className='fx-stat'>
                            <div className='fx-stat-value' style={{ color: theme.primary }}>
                                {draw.bracketSize}
                            </div>
                            <div className='fx-stat-label'>Bracket slots</div>
                        </div>
                        <div className='fx-stat'>
                            <div className='fx-stat-value' style={{ color: theme.primary }}>
                                {draw.rankedCount}
                            </div>
                            <div className='fx-stat-label'>Seeded</div>
                        </div>
                        <div className='fx-stat'>
                            <div className='fx-stat-value' style={{ color: theme.primary }}>
                                {draw.unrankedCount}
                            </div>
                            <div className='fx-stat-label'>Drawn</div>
                        </div>
                        <div className='fx-stat'>
                            <div className='fx-stat-value' style={{ color: theme.primary }}>
                                {draw.byes}
                            </div>
                            <div className='fx-stat-label'>Byes</div>
                        </div>
                        <div className='fx-stat'>
                            <div className='fx-stat-value' style={{ color: theme.primary }}>
                                {draw.rounds.length}
                            </div>
                            <div className='fx-stat-label'>Rounds</div>
                        </div>
                    </div>

                    {draw.byes > 0 && (
                        <div className='fx-note'>
                            {draw.bracketSize} slots for {draw.totalPlayers} players leaves{' '}
                            {draw.byes} bye{draw.byes > 1 ? 's' : ''}, which go to the highest
                            ranked players - seed{draw.byes > 1 ? 's' : ''} 1
                            {draw.byes > 1 ? ' to ' + draw.byes : ''}.
                        </div>
                    )}

                    {draw.warnings.map((warning) => (
                        <div className='fx-note warn' key={warning}>{warning}</div>
                    ))}

                    <BracketView draw={draw} />
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

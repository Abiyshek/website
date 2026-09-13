import React, { useContext, useRef, useState } from 'react';
import {
    Button, TextField, IconButton, Chip, LinearProgress,
} from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import { ThemeContext } from '../../contexts/ThemeContext';
import { parsePlayerList, findDuplicates, recognizeImageText } from '../../utils/fixtures';

/**
 * Entry of the field: the ranked players are typed in ranking order, the rest
 * arrive as a pasted block or as a photo of the entry sheet.
 */
export default function PlayerInput({
    rankedRows,
    setRankedRows,
    unrankedText,
    setUnrankedText,
}) {
    const { theme } = useContext(ThemeContext);
    const fileRef = useRef(null);
    const [ocrBusy, setOcrBusy] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [ocrError, setOcrError] = useState('');

    const unranked = parsePlayerList(unrankedText);
    const ranked = rankedRows.filter((row) => row.name.trim());
    const duplicates = findDuplicates(ranked.concat(unranked));
    const clubs = Array.from(new Set(
        ranked.concat(unranked).map((p) => p.club.trim()).filter(Boolean),
    ));

    const updateRow = (index, field, value) => {
        const next = rankedRows.slice();
        next[index] = { ...next[index], [field]: value };
        setRankedRows(next);
    };

    const moveRow = (index, delta) => {
        const target = index + delta;
        if (target < 0 || target >= rankedRows.length) return;
        const next = rankedRows.slice();
        const tmp = next[index];
        next[index] = next[target];
        next[target] = tmp;
        setRankedRows(next);
    };

    const removeRow = (index) => {
        setRankedRows(rankedRows.filter((_, i) => i !== index));
    };

    const addRow = () => {
        setRankedRows(rankedRows.concat([{ name: '', club: '' }]));
    };

    const handleImage = async (event) => {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file) return;

        setOcrError('');
        setOcrBusy(true);
        setOcrProgress(0);
        try {
            const text = await recognizeImageText(file, setOcrProgress);
            const found = parsePlayerList(text);
            if (found.length === 0) {
                setOcrError('No names could be read from that image. Try a sharper, '
                    + 'straight-on photo, or type the names in below.');
            } else {
                const existing = unrankedText.trim();
                const addition = found
                    .map((p) => (p.club ? p.name + ', ' + p.club : p.name))
                    .join('\n');
                setUnrankedText(existing ? existing + '\n' + addition : addition);
            }
        } catch (error) {
            setOcrError(error.message || 'The photo could not be read.');
        } finally {
            setOcrBusy(false);
        }
    };

    return (
        <div>
            <div className='fx-card'>
                <h2 className='fx-section-title'>1. Ranked players</h2>
                <p className='fx-hint'>
                    Type them in ranking order - row 1 is the #1 seed. These are the players the
                    draw protects: they are placed in their traditional seed positions, they take
                    the byes when the field is not a power of two, and #1 and #2 can only meet in
                    the final. Leave a row blank to skip it.
                </p>

                {rankedRows.map((row, index) => (
                    <div className='fx-row' key={'ranked-' + index}>
                        <div
                            className='fx-row-index'
                            style={{ background: theme.primary }}
                        >
                            {index + 1}
                        </div>
                        <TextField
                            variant='outlined'
                            size='small'
                            label={'Rank ' + (index + 1) + ' - player name'}
                            value={row.name}
                            onChange={(e) => updateRow(index, 'name', e.target.value)}
                            style={{ flex: '2 1 220px' }}
                        />
                        <TextField
                            variant='outlined'
                            size='small'
                            label='Club'
                            value={row.club}
                            onChange={(e) => updateRow(index, 'club', e.target.value)}
                            style={{ flex: '1 1 150px' }}
                        />
                        <IconButton size='small' onClick={() => moveRow(index, -1)} title='Move up'>
                            <ArrowUpwardIcon fontSize='small' />
                        </IconButton>
                        <IconButton size='small' onClick={() => moveRow(index, 1)} title='Move down'>
                            <ArrowDownwardIcon fontSize='small' />
                        </IconButton>
                        <IconButton size='small' onClick={() => removeRow(index)} title='Remove'>
                            <DeleteOutlineIcon fontSize='small' />
                        </IconButton>
                    </div>
                ))}

                <Button
                    startIcon={<AddIcon />}
                    onClick={addRow}
                    style={{ marginTop: '0.5rem' }}
                >
                    Add another ranked player
                </Button>
            </div>

            <div className='fx-card'>
                <h2 className='fx-section-title'>2. Unranked players</h2>
                <p className='fx-hint'>
                    One player per line, club after a comma - <em>Arun Kumar, LASA</em>. A dash,
                    a pipe or brackets work too, and numbering is stripped automatically. These
                    players are drawn at random into whatever seats the seeds leave open.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                    <Button
                        variant='outlined'
                        startIcon={<PhotoCameraIcon />}
                        onClick={() => fileRef.current && fileRef.current.click()}
                        disabled={ocrBusy}
                    >
                        {ocrBusy ? 'Reading photo...' : 'Read names from a photo'}
                    </Button>
                    <Button
                        variant='outlined'
                        color='secondary'
                        onClick={() => setUnrankedText('')}
                        disabled={!unrankedText}
                    >
                        Clear list
                    </Button>
                    <input
                        ref={fileRef}
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={handleImage}
                    />
                </div>

                {ocrBusy && (
                    <div style={{ marginBottom: '0.9rem' }}>
                        <LinearProgress
                            variant={ocrProgress > 0 ? 'determinate' : 'indeterminate'}
                            value={ocrProgress}
                        />
                        <span className='fx-hint'>
                            {ocrProgress > 0
                                ? 'Reading the entry sheet - ' + ocrProgress + '%'
                                : 'Fetching the text-recognition model - the first photo of a '
                                + 'session takes a minute or so, later ones are quick.'}
                        </span>
                    </div>
                )}

                {ocrError && <div className='fx-note error'>{ocrError}</div>}

                <div className='fx-note'>
                    Names read from a photo land in the box below so they can be checked and
                    corrected first. Handwriting and unusual spellings are often misread - a
                    capital I comes back as a lowercase l often enough - and a draw should never
                    run on an unchecked name. Reading a photo needs an internet connection.
                </div>

                <TextField
                    variant='outlined'
                    multiline
                    minRows={8}
                    fullWidth
                    label='Unranked players (one per line)'
                    placeholder={'Arun Kumar, LASA\nPriya S - Spin Academy\nRahul (Ace TT)'}
                    value={unrankedText}
                    onChange={(e) => setUnrankedText(e.target.value)}
                />

                <div className='fx-stats'>
                    <div className='fx-stat'>
                        <div className='fx-stat-value' style={{ color: theme.primary }}>
                            {ranked.length}
                        </div>
                        <div className='fx-stat-label'>Ranked</div>
                    </div>
                    <div className='fx-stat'>
                        <div className='fx-stat-value' style={{ color: theme.primary }}>
                            {unranked.length}
                        </div>
                        <div className='fx-stat-label'>Unranked</div>
                    </div>
                    <div className='fx-stat'>
                        <div className='fx-stat-value' style={{ color: theme.primary }}>
                            {ranked.length + unranked.length}
                        </div>
                        <div className='fx-stat-label'>Total players</div>
                    </div>
                    <div className='fx-stat'>
                        <div className='fx-stat-value' style={{ color: theme.primary }}>
                            {clubs.length}
                        </div>
                        <div className='fx-stat-label'>Clubs</div>
                    </div>
                </div>

                {clubs.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {clubs.map((club) => (
                            <Chip key={club} label={club} size='small' />
                        ))}
                    </div>
                )}

                {duplicates.length > 0 && (
                    <div className='fx-note warn'>
                        <strong>Repeated name{duplicates.length > 1 ? 's' : ''}:</strong>{' '}
                        {duplicates.join(', ')}. Two players can genuinely share a name, but this
                        is usually a line entered twice or a photo read twice.
                    </div>
                )}
            </div>
        </div>
    );
}

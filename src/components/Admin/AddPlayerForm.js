import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    section: {
        padding: '1.5rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #efefef',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#333',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
    },
    playerCard: {
        marginBottom: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fafafa',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: '#333',
    },
}));

export default function AddPlayerForm() {
    const classes = useStyles();
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState({
        name: '',
        role: '',
        description: '',
        imageUrl: '',
    });
    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentPlayer({ ...currentPlayer, [name]: value });
    };

    const handleAddPlayer = () => {
        if (!currentPlayer.name || !currentPlayer.role) {
            alert('❌ Please fill in name and role');
            return;
        }

        setPlayers([...players, { ...currentPlayer, id: Date.now() }]);
        setCurrentPlayer({ name: '', role: '', description: '', imageUrl: '' });
    };

    const removePlayer = (id) => {
        setPlayers(players.filter((p) => p.id !== id));
    };

    const handleUpload = async () => {
        if (players.length === 0) {
            alert('❌ Please add at least one player');
            return;
        }

        setUploading(true);

        try {
            const response = await fetch('/api/upload/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    players: players.map(p => ({
                        name: p.name,
                        role: p.role,
                        description: p.description || 'Dedicated player',
                        imageUrl: p.imageUrl || `https://via.placeholder.com/300x300?text=${p.name}`
                    }))
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setSuccessMessage(
                `${data.message}\n\n` +
                `Players added:\n${data.players.map((p) => `✅ ${p}`).join('\n')}\n\n` +
                `🔄 Project rebuilt automatically!\n` +
                `📱 Your players should appear in "newly-added" section now.`
            );
            setShowSuccess(true);
            setPlayers([]);
        } catch (error) {
            alert(`❌ Upload failed: ${error.message}\n\n💡 Make sure the server is running:\nnpm start`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box className={classes.form}>
            <Box className={classes.section}>
                <Typography className={classes.title} variant="h6">
                    👤 Add Multiple Players
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '1.5rem' }}>
                    Add player details below (add many at once)
                </Typography>

                <div className={classes.label}>Player Name *</div>
                <TextField
                    fullWidth
                    name="name"
                    value={currentPlayer.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Arun Kumar"
                    variant="outlined"
                    size="small"
                    style={{ marginBottom: '1rem' }}
                    autoFocus
                />

                <div className={classes.label}>Role / Title *</div>
                <TextField
                    fullWidth
                    name="role"
                    value={currentPlayer.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Champion, Coach, Rising Star"
                    variant="outlined"
                    size="small"
                    style={{ marginBottom: '1rem' }}
                />

                <div className={classes.label}>Description (Optional)</div>
                <TextField
                    fullWidth
                    name="description"
                    value={currentPlayer.description}
                    onChange={handleInputChange}
                    placeholder="e.g., State champion with 5 years of experience"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={2}
                    style={{ marginBottom: '1rem' }}
                />

                <div className={classes.label}>Profile Image URL</div>
                <TextField
                    fullWidth
                    name="imageUrl"
                    value={currentPlayer.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg (optional)"
                    variant="outlined"
                    size="small"
                    style={{ marginBottom: '1rem' }}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddPlayer}
                    startIcon={<AddIcon />}
                    fullWidth
                >
                    Add Player to List
                </Button>
            </Box>

            {players.length > 0 && (
                <Box>
                    <Typography className={classes.title} variant="h6">
                        📋 Players to Upload ({players.length})
                    </Typography>
                    {players.map((player, index) => (
                        <Card key={player.id} className={classes.playerCard}>
                            <CardContent style={{ paddingBottom: '1rem' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="start">
                                    <Box flex={1}>
                                        <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                                            {index + 1}. {player.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {player.role}
                                        </Typography>
                                        {player.description && (
                                            <Typography variant="caption" style={{ marginTop: '0.5rem', display: 'block' }}>
                                                {player.description}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        onClick={() => removePlayer(player.id)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Box className={classes.buttonGroup}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={uploading || players.length === 0}
                    size="large"
                >
                    {uploading ? '⏳ Processing...' : `✅ Upload ${players.length} Player(s)`}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setPlayers([]);
                        setCurrentPlayer({ name: '', role: '', description: '', imageUrl: '' });
                    }}
                    disabled={uploading}
                >
                    Clear All
                </Button>
            </Box>

            <Dialog open={showSuccess} onClose={() => setShowSuccess(false)} maxWidth="sm" fullWidth>
                <DialogTitle>✅ Players Added to "newly-added"</DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="center" gap={1} style={{ marginTop: '1rem' }}>
                        <CheckCircleIcon style={{ color: '#4caf50', fontSize: '2rem' }} />
                        <Typography
                            variant="body2"
                            style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                backgroundColor: '#f5f5f5',
                                padding: '1rem',
                                borderRadius: '4px',
                                flex: 1,
                            }}
                        >
                            {successMessage}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSuccess(false)} color="primary" variant="contained">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Chip,
    Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { playerProfilesData } from '../../data/playerProfilesData';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '1rem 0',
    },
    grid: {
        marginTop: '1rem',
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
    },
    media: {
        paddingTop: '100%',
    },
    cardContent: {
        flexGrow: 1,
    },
    deleteBtn: {
        marginTop: '1rem',
        color: '#d32f2f',
        width: '100%',
    },
    chipContainer: {
        marginTop: '0.5rem',
    },
}));

export default function ManagePlayers() {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handleDelete = (player) => {
        setSelectedPlayer(player);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        setOpenDialog(false);
        alert(`❌ To delete player "${selectedPlayer.name}":
        
1. Edit: src/data/playerProfilesData.js
2. Remove the player object with id: ${selectedPlayer.id}
3. Update remaining player IDs if needed
4. Run: npm run build

Note: Run this command in terminal.`);
        setSelectedPlayer(null);
    };

    if (!playerProfilesData || playerProfilesData.length === 0) {
        return (
            <Box className={classes.root}>
                <Paper style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
                    <Typography>ℹ️ No players found</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className={classes.root}>
            <Paper style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
                <Typography>✅ Found {playerProfilesData.length} player(s)</Typography>
            </Paper>

            <Grid container spacing={3} className={classes.grid}>
                {playerProfilesData.map((player) => (
                    <Grid item xs={12} sm={6} md={4} key={player.id}>
                        <Card className={classes.card}>
                            {player.image && (
                                <CardMedia
                                    className={classes.media}
                                    image={player.image}
                                    title={player.name}
                                />
                            )}
                            <CardContent className={classes.cardContent}>
                                <Typography variant="h6" gutterBottom>
                                    {player.name}
                                </Typography>
                                <Chip
                                    label={player.role}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    className={classes.chipContainer}
                                />
                                <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                                    {player.description}
                                </Typography>
                                <Typography variant="caption" display="block" style={{ marginTop: '0.5rem' }}>
                                    ID: {player.id}
                                </Typography>
                            </CardContent>
                            <Button
                                size="small"
                                startIcon={<DeleteIcon />}
                                className={classes.deleteBtn}
                                onClick={() => handleDelete(player)}
                            >
                                Delete Player
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Player?</DialogTitle>
                <DialogContent>
                    {selectedPlayer && (
                        <Typography>
                            Are you sure you want to delete <strong>"{selectedPlayer.name}"</strong> ({selectedPlayer.role})?
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="secondary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

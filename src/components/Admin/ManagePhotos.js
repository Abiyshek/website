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
    Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { galleryData } from '../../data/galleryData';

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
    deleteBtn: {
        marginTop: 'auto',
        color: '#d32f2f',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem 1rem',
        color: '#999',
    },
}));

export default function ManagePhotos() {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleDelete = (photo) => {
        setSelectedPhoto(photo);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        setOpenDialog(false);
        alert(`❌ To delete photo "${selectedPhoto.alt}":
        
1. Remove the import from: src/data/galleryData.js
2. Remove the data object from the galleryData array
3. Delete the photo file from: src/assets/gallery/[CATEGORY]/
4. Renumber remaining photos if needed
5. Run: npm run build

Note: Run this command in terminal.`);
        setSelectedPhoto(null);
    };

    if (!galleryData || galleryData.length === 0) {
        return (
            <Box className={classes.root}>
                <Paper style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
                    <Typography>ℹ️ No photos found</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className={classes.root}>
            <Paper style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
                <Typography>✅ Found {galleryData.length} photo(s)</Typography>
            </Paper>

            <Grid container spacing={2} className={classes.grid}>
                {galleryData.map((photo) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.media}
                                image={
                                    typeof photo.src === 'string'
                                        ? photo.src
                                        : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3C/svg%3E'
                                }
                                title={photo.alt}
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" noWrap>
                                    {photo.alt}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    ID: {photo.id}
                                </Typography>
                            </CardContent>
                            <Button
                                size="small"
                                startIcon={<DeleteIcon />}
                                className={classes.deleteBtn}
                                onClick={() => handleDelete(photo)}
                            >
                                Delete
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Photo?</DialogTitle>
                <DialogContent>
                    {selectedPhoto && (
                        <Typography>
                            Are you sure you want to delete <strong>"{selectedPhoto.alt}"</strong>?
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

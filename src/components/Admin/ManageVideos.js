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
import { videoData } from '../../data/videoData';

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
        paddingTop: '56.25%',
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

export default function ManageVideos() {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleDelete = (video) => {
        setSelectedVideo(video);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        setOpenDialog(false);
        alert(`❌ To delete video "${selectedVideo.title}":
        
1. Remove the import from: src/data/videoData.js
2. Remove the data object from the videoData array
3. Delete the video file from: src/assets/videos/${selectedVideo.title}.mp4
4. Delete the thumbnail from: src/assets/videos/thumbnails/
5. Run: npm run generate:videos
6. Run: npm run build

Note: Run these commands in terminal.`);
        setSelectedVideo(null);
    };

    if (!videoData || videoData.length === 0) {
        return (
            <Box className={classes.root}>
                <Paper style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
                    <Typography>ℹ️ No videos found</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className={classes.root}>
            <Paper style={{ padding: '1rem', marginBottom: '2rem', backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
                <Typography>✅ Found {videoData.length} video(s)</Typography>
            </Paper>

            <Grid container spacing={3} className={classes.grid}>
                {videoData.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.media}
                                image={
                                    typeof video.thumbnail === 'string'
                                        ? video.thumbnail
                                        : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3C/svg%3E'
                                }
                                title={video.title}
                            />
                            <CardContent style={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ID: {video.id}
                                </Typography>
                            </CardContent>
                            <Button
                                size="small"
                                startIcon={<DeleteIcon />}
                                className={classes.deleteBtn}
                                onClick={() => handleDelete(video)}
                            >
                                Delete
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Video?</DialogTitle>
                <DialogContent>
                    {selectedVideo && (
                        <Typography>
                            Are you sure you want to delete <strong>"{selectedVideo.title}"</strong>?
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

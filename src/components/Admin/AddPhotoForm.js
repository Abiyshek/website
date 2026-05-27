import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FileUploadArea from './FileUploadArea';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

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
    successBox: {
        backgroundColor: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '8px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    errorBox: {
        backgroundColor: '#ffebee',
        border: '2px solid #f44336',
        borderRadius: '8px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    statusIcon: {
        fontSize: '2rem',
    },
}));

const CATEGORIES = [
    'Aaradhana',
    'Amala',
    'Anbuchelvi',
    'Arunesh',
    'Coach',
    'Dhivyesh',
    'Group photo',
    'Jenifer',
    'Kanmani',
    'Lasa honoring functions',
    'Lasa state rankings',
    'Mithun',
    'new',
    'Ruhaan',
    'Samanatha',
];

export default function AddPhotoForm() {
    const classes = useStyles();
    const [selectedCategory, setSelectedCategory] = useState('new');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleFilesSelected = (files) => {
        setSelectedFiles(files);
        setUploadStatus(null);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setUploadStatus({ type: 'error', message: '❌ Please select at least one photo' });
            return;
        }

        setUploading(true);
        setUploadStatus(null);

        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('photos', file);
            });
            formData.append('category', selectedCategory);

            const response = await fetch('http://localhost:5000/api/upload/photos', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setSuccessMessage(
                `${data.message}\n\n` +
                `Photos added:\n${data.photos.map((p) => `✅ ${p}`).join('\n')}\n\n` +
                `📂 Saved to: src/assets/gallery/${selectedCategory}/\n` +
                `🔄 Project rebuilt automatically!\n` +
                `📱 Your photos should appear in "newly-added" section now.`
            );
            setShowSuccess(true);
            setSelectedFiles([]);
        } catch (error) {
            setUploadStatus({
                type: 'error',
                message: `❌ Upload failed: ${error.message}\n\n💡 Make sure the server is running:\nnpm start`,
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box className={classes.form}>
            <Box className={classes.section}>
                <Typography className={classes.title} variant="h6">
                    🖼️ Select Category
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat === 'new' ? '⭐ new (latest uploads)' : cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box className={classes.section}>
                <Typography className={classes.title} variant="h6">
                    📸 Select Multiple Photos
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '1.5rem' }}>
                    Choose JPG, PNG, or WebP images - they'll go to the "{selectedCategory}" section
                </Typography>
                <FileUploadArea
                    onFilesSelected={handleFilesSelected}
                    accept="image/*"
                    multiple={true}
                />
            </Box>

            {uploadStatus && (
                <Box
                    className={uploadStatus.type === 'error' ? classes.errorBox : classes.successBox}
                >
                    {uploadStatus.type === 'error' ? (
                        <ErrorIcon className={classes.statusIcon} style={{ color: '#f44336' }} />
                    ) : (
                        <CheckCircleIcon className={classes.statusIcon} style={{ color: '#4caf50' }} />
                    )}
                    <Typography variant="body2">{uploadStatus.message}</Typography>
                </Box>
            )}

            <Box className={classes.buttonGroup}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                    size="large"
                >
                    {uploading ? '⏳ Processing...' : `✅ Upload ${selectedFiles.length} Photo(s)`}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSelectedFiles([]);
                        setUploadStatus(null);
                    }}
                    disabled={uploading}
                >
                    Clear Selection
                </Button>
            </Box>

            <Dialog open={showSuccess} onClose={() => setShowSuccess(false)} maxWidth="sm" fullWidth>
                <DialogTitle>✅ Photos Added to "{selectedCategory}"</DialogTitle>
                <DialogContent>
                    <Typography
                        variant="body2"
                        style={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            backgroundColor: '#f5f5f5',
                            padding: '1rem',
                            borderRadius: '4px',
                            marginTop: '1rem',
                        }}
                    >
                        {successMessage}
                    </Typography>
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

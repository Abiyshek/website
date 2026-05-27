import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Box,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
    uploadArea: {
        border: '2px dashed #1976d2',
        borderRadius: '8px',
        padding: theme.spacing(3),
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: '#f5f5f5',
        '&:hover': {
            backgroundColor: '#e3f2fd',
            borderColor: '#1565c0',
        },
        '&.dragover': {
            backgroundColor: '#bbdefb',
            borderColor: '#0d47a1',
        },
    },
    fileInput: {
        display: 'none',
    },
    fileList: {
        marginTop: theme.spacing(2),
    },
    fileItem: {
        backgroundColor: '#f5f5f5',
        marginBottom: theme.spacing(1),
        borderRadius: '4px',
    },
}));

const FileUploadArea = ({ onFilesSelected, accept = '*', multiple = true }) => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = React.useRef();

    const handleFileSelect = (selectedFiles) => {
        const fileArray = Array.from(selectedFiles);
        setFiles((prev) => [...prev, ...fileArray]);
        onFilesSelected([...files, ...fileArray]);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    };

    return (
        <Box>
            <Paper
                className={`${classes.uploadArea} ${dragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <CloudUploadIcon style={{ fontSize: '3rem', color: '#1976d2', marginBottom: '1rem' }} />
                <Typography variant="h6" gutterBottom>
                    Drag & Drop Files Here
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    or click to select
                </Typography>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    className={classes.fileInput}
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
            </Paper>

            {files.length > 0 && (
                <Box className={classes.fileList}>
                    <Typography variant="subtitle2" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                        Selected Files ({files.length}):
                    </Typography>
                    <List>
                        {files.map((file, index) => (
                            <ListItem key={index} className={classes.fileItem}>
                                <ListItemText
                                    primary={file.name}
                                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        size="small"
                                        onClick={() => removeFile(index)}
                                        color="secondary"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default FileUploadArea;

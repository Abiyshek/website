import React, { useState } from 'react';
import {
    Box,
    Container,
    Tabs,
    Tab,
    Paper,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AddVideoForm from './AddVideoForm';
import AddPhotoForm from './AddPhotoForm';
import AddPlayerForm from './AddPlayerForm';
import ManageVideos from './ManageVideos';
import ManagePhotos from './ManagePhotos';
import ManagePlayers from './ManagePlayers';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '2rem 0',
    },
    container: {
        maxWidth: 1000,
    },
    paper: {
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    tabPanel: {
        padding: '2rem 0',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    loginContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2rem',
    },
    passwordField: {
        marginTop: '1rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

export default function Admin() {
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);
    const [isLocked, setIsLocked] = useState(true);
    const [password, setPassword] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const ADMIN_PASSWORD = 'admin123'; // ⚠️ Change this password!

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleUnlock = () => {
        if (password === ADMIN_PASSWORD) {
            setIsLocked(false);
        } else {
            alert('❌ Incorrect password');
            setPassword('');
        }
    };

    const handleLock = () => {
        setOpenDialog(true);
    };

    const confirmLock = () => {
        setOpenDialog(false);
        setIsLocked(true);
        setPassword('');
        setTabValue(0);
    };

    if (isLocked) {
        return (
            <Box className={classes.root}>
                <Container maxWidth="sm" style={{ paddingTop: '4rem' }}>
                    <Paper className={classes.paper}>
                        <div className={classes.title}>
                            <LockIcon style={{ fontSize: '2rem', color: '#d32f2f' }} />
                            Admin Panel - Locked
                        </div>
                        <div className={classes.loginContainer}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Admin Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                                variant="outlined"
                                autoFocus
                                placeholder="Enter password to unlock"
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleUnlock}
                            >
                                Unlock
                            </Button>
                            <Paper style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3', marginTop: '1rem' }}>
                                <Typography>🔒 <strong>Default Password:</strong> admin123</Typography>
                            </Paper>
                            <Paper style={{ padding: '1rem', backgroundColor: '#fff3e0', borderLeft: '4px solid #ff9800', marginTop: '1rem' }}>
                                <Typography>⚠️ <strong>Change the password in Admin.js for security!</strong></Typography>
                            </Paper>
                        </div>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box className={classes.root}>
            <Container maxWidth="lg" className={classes.container}>
                <Paper className={classes.paper}>
                    <Box className={classes.header}>
                        <div className={classes.title}>
                            <LockOpenIcon style={{ fontSize: '2rem', color: '#4caf50' }} />
                            Admin Panel
                        </div>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={handleLock}
                        >
                            🔒 Lock
                        </Button>
                    </Box>

                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="admin-tabs"
                        style={{ borderBottom: '2px solid #ddd' }}
                    >
                        <Tab label="📹 Add Video" id="admin-tab-0" aria-controls="admin-tabpanel-0" />
                        <Tab label="📸 View Videos" id="admin-tab-1" aria-controls="admin-tabpanel-1" />
                        <Tab label="🖼️ Add Photo" id="admin-tab-2" aria-controls="admin-tabpanel-2" />
                        <Tab label="👁️ View Photos" id="admin-tab-3" aria-controls="admin-tabpanel-3" />
                        <Tab label="👤 Add Player" id="admin-tab-4" aria-controls="admin-tabpanel-4" />
                        <Tab label="👥 View Players" id="admin-tab-5" aria-controls="admin-tabpanel-5" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
                        <AddVideoForm />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
                        <ManageVideos />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2} className={classes.tabPanel}>
                        <AddPhotoForm />
                    </TabPanel>

                    <TabPanel value={tabValue} index={3} className={classes.tabPanel}>
                        <ManagePhotos />
                    </TabPanel>

                    <TabPanel value={tabValue} index={4} className={classes.tabPanel}>
                        <AddPlayerForm />
                    </TabPanel>

                    <TabPanel value={tabValue} index={5} className={classes.tabPanel}>
                        <ManagePlayers />
                    </TabPanel>
                </Paper>
            </Container>

            {/* Confirm Lock Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Lock Admin Panel?</DialogTitle>
                <DialogContent>
                    Are you sure you want to lock the admin panel? You'll need to enter the password again.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmLock} color="secondary" variant="contained">
                        Lock
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

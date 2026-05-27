import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    Typography,
    Grid,
    Container
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { testimonialsData } from '../../data/testimonialsData';
import { ThemeContext } from '../../contexts/ThemeContext';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '2rem 1rem',
        minHeight: '100vh'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem'
    },
    card: {
        marginBottom: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    textField: {
        marginBottom: '1rem'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem'
    },
    successAlert: {
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#c8e6c9',
        border: '1px solid #81c784',
        borderRadius: '4px',
        color: '#2e7d32'
    }
}));

function TestimonialsEditor() {
    const classes = useStyles();
    const { theme } = useContext(ThemeContext);
    const [testimonials, setTestimonials] = useState(testimonialsData);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Load saved data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('testimonialsData');
        if (saved) {
            try {
                setTestimonials(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load saved testimonials');
            }
        }
    }, []);

    const handleFieldChange = (id, field, value) => {
        setTestimonials(testimonials.map(test =>
            test.id === id ? { ...test, [field]: value } : test
        ));
    };

    const handleSave = () => {
        localStorage.setItem('testimonialsData', JSON.stringify(testimonials));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleReset = () => {
        if (window.confirm('Reset all changes? This will load original testimonials.')) {
            setTestimonials(testimonialsData);
            localStorage.removeItem('testimonialsData');
        }
    };

    return (
        <Container maxWidth="md" className={classes.container} style={{ backgroundColor: theme.secondary }}>
            <Box className={classes.header}>
                <Typography variant="h3" style={{ color: theme.primary, marginBottom: '1rem' }}>
                    ✏️ Edit Testimonials
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Add full text for each testimonial. Your changes are saved to your browser.
                </Typography>
            </Box>

            {saveSuccess && (
                <Box className={classes.successAlert}>
                    <Typography>✅ Testimonials saved successfully!</Typography>
                </Box>
            )}

            <Grid container spacing={3}>
                {testimonials.map((testimonial) => (
                    <Grid item xs={12} key={testimonial.id}>
                        <Card className={classes.card} style={{ borderLeft: `4px solid ${theme.primary}` }}>
                            <CardContent>
                                {/* Name and Title - Read Only */}
                                <Box style={{ marginBottom: '1.5rem' }}>
                                    <Typography variant="h5" style={{ color: theme.primary, fontWeight: 'bold' }}>
                                        {testimonial.id}. {testimonial.name}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {testimonial.title}
                                    </Typography>
                                </Box>

                                {/* Short Text */}
                                <TextField
                                    label="Short Testimonial (currently shown)"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={testimonial.text}
                                    onChange={(e) => handleFieldChange(testimonial.id, 'text', e.target.value)}
                                    className={classes.textField}
                                    placeholder="Short version shown in carousel"
                                />

                                {/* Full Text */}
                                <TextField
                                    label="Full Story (shown when clicked)"
                                    fullWidth
                                    multiline
                                    rows={6}
                                    variant="outlined"
                                    value={testimonial.fullText || ''}
                                    onChange={(e) => handleFieldChange(testimonial.id, 'fullText', e.target.value)}
                                    className={classes.textField}
                                    placeholder="Enter the full, detailed testimonial here. This appears in the modal when someone clicks the testimonial."
                                    helperText={`${(testimonial.fullText || '').length} characters`}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Action Buttons */}
            <Box className={classes.buttonGroup} style={{ justifyContent: 'center', marginTop: '2rem' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    style={{ backgroundColor: theme.primary, color: theme.secondary }}
                >
                    💾 Save All Changes
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={handleReset}
                >
                    🔄 Reset to Original
                </Button>
            </Box>

            <Box style={{ marginTop: '2rem', padding: '1rem', backgroundColor: theme.primary, borderRadius: '8px', color: theme.secondary }}>
                <Typography variant="body2">
                    <strong>💡 Tip:</strong> Write as much as you want in the "Full Story" field. Users will see the short version in the carousel, and when they click on a testimonial, they'll see the complete story in a popup. Your edits are saved in your browser's local storage.
                </Typography>
            </Box>
        </Container>
    );
}

export default TestimonialsEditor;

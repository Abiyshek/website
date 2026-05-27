import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Fade from 'react-reveal/Fade';
import { HiArrowRight } from "react-icons/hi";
import { ThemeContext } from '../../contexts/ThemeContext';
import { galleryData } from '../../data/galleryData';
import './Gallery.css';

const Gallery = () => {
    const { theme } = useContext(ThemeContext);

    // Show only first 7 images on main page
    const firstRowImages = galleryData.slice(0, 4);  // First 4 images
    const secondRowImages = galleryData.slice(4, 7); // Next 3 images

    const useStyles = makeStyles({
        galleryWrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            gap: '2rem',
        },
        galleryContent: {
            width: '100%',
            minWidth: '0',
        },
        galleryGrid: {
            display: 'grid',
            gap: '1.5rem',
            marginBottom: '1.5rem',
        },
        firstRow: {
            gridTemplateColumns: 'repeat(4, 1fr)',
            '@media (max-width: 1200px)': {
                gridTemplateColumns: 'repeat(3, 1fr)',
            },
            '@media (max-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
            },
            '@media (max-width: 480px)': {
                gridTemplateColumns: '1fr',
            },
        },
        secondRow: {
            gridTemplateColumns: 'repeat(3, 1fr)',
            justifyContent: 'center',
            paddingLeft: 'calc((100% / 8))',
            paddingRight: 'calc((100% / 8))',
            '@media (max-width: 1200px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
                paddingLeft: 'calc((100% / 4))',
                paddingRight: 'calc((100% / 4))',
            },
            '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr',
                paddingLeft: '0',
                paddingRight: '0',
            },
        },
        galleryItem: {
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
                transform: 'scale(1.05)',
            },
        },
        galleryImage: {
            width: '100%',
            height: '300px',
            objectFit: 'cover',
        },
        viewAllContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
        },
        viewAllBtn: {
            color: theme.secondary, 
            backgroundColor: theme.primary,
            transition: '250ms ease-in-out',
            padding: '14px 40px',
            fontSize: '1.1rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            whiteSpace: 'nowrap',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            "&:hover": {
                transform: 'scale(1.08)',
                color: theme.secondary, 
                backgroundColor: theme.tertiary,
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
            }
        },
        viewArr: {
            marginLeft: '0.5rem',
            transition: 'transform 0.3s ease',
        },
    });

    const classes = useStyles();

    return (
        <div id="gallery" className="gallery-container" style={{ backgroundColor: theme.secondary }}>
            <h2 style={{ color: theme.primary, textAlign: 'center', paddingTop: '2rem' }}>
                Club Gallery
            </h2>
            <div className={classes.galleryWrapper}>
                <div className={classes.galleryContent}>
                    {/* First row with 4 images */}
                    <div className={`${classes.galleryGrid} ${classes.firstRow}`}>
                        {firstRowImages.length > 0 && (
                            firstRowImages.map(image => (
                                <Fade key={image.id} bottom>
                                    <div className={classes.galleryItem}>
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className={classes.galleryImage}
                                        />
                                    </div>
                                </Fade>
                            ))
                        )}
                    </div>

                    {/* Second row with 3 centered images */}
                    {secondRowImages.length > 0 && (
                        <div className={`${classes.galleryGrid} ${classes.secondRow}`}>
                            {secondRowImages.map(image => (
                                <Fade key={image.id} bottom>
                                    <div className={classes.galleryItem}>
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className={classes.galleryImage}
                                        />
                                    </div>
                                </Fade>
                            ))}
                        </div>
                    )}
                </div>
                {galleryData.length > 7 && (
                    <div className={classes.viewAllContainer}>
                        <Link to="/gallery">
                            <button className={classes.viewAllBtn}>
                                View All
                                <HiArrowRight className={classes.viewArr} />
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;


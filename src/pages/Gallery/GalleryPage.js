import React, { useContext, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fade from 'react-reveal/Fade';
import { ThemeContext } from '../../contexts/ThemeContext';
import { galleryData } from '../../data/galleryData';
import { Navbar, Footer } from '../../components';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import './GalleryPage.css';

const GalleryPage = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImageIndex(null);
    };

    const handlePrevImage = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedImageIndex(prev => 
            prev > 0 ? prev - 1 : galleryData.length - 1
        );
    }, []);

    const handleNextImage = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedImageIndex(prev => 
            prev < galleryData.length - 1 ? prev + 1 : 0
        );
    }, []);

    // Keyboard navigation
    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                handlePrevImage({ stopPropagation: () => {} });
            } else if (e.key === 'ArrowRight') {
                handleNextImage({ stopPropagation: () => {} });
            } else if (e.key === 'Escape') {
                handleCloseModal();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isModalOpen, handlePrevImage, handleNextImage]);

    const useStyles = makeStyles({
        galleryContainer: {
            minHeight: '100vh',
            backgroundColor: theme.secondary,
            paddingTop: '80px',
            paddingBottom: '40px',
        },
        gallery: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '3rem 2rem',
            maxWidth: '1400px',
            margin: '0 auto',
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
            height: '350px',
            objectFit: 'cover',
        },
        header: {
            textAlign: 'center',
            color: theme.primary,
            paddingTop: '2rem',
            paddingBottom: '1rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
        },
        modalContent: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '90vw',
            maxHeight: '90vh',
        },
        modalImage: {
            maxWidth: '100%',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: '8px',
        },
        arrowButton: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            fontSize: '3rem',
            cursor: 'pointer',
            padding: '1rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-50%) scale(1.1)',
            },
        },
        leftArrow: {
            left: '2rem',
        },
        rightArrow: {
            right: '2rem',
        },
        imageCounter: {
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '1.1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
        },
    });

    const classes = useStyles();

    // Separate newly added photos
    const newlyAddedPhotos = galleryData.filter(p => p.isNew);
    const allOtherPhotos = galleryData.filter(p => !p.isNew);
    const allPhotos = [...newlyAddedPhotos, ...allOtherPhotos];

    const renderGalleryItems = (photos, startIndex = 0) => (
        photos.map((image, index) => {
            const absoluteIndex = startIndex + index;
            return (
                <Fade key={image.id} bottom>
                    <div 
                        className={classes.galleryItem}
                        onClick={() => handleImageClick(absoluteIndex)}
                        style={{ position: 'relative' }}
                    >
                        {image.isNew && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                zIndex: 10
                            }}>
                                ⭐ NEW
                            </div>
                        )}
                        <img
                            src={image.src}
                            alt={image.alt}
                            className={classes.galleryImage}
                        />
                    </div>
                </Fade>
            );
        })
    );

    return (
        <>
            <Navbar />
            <div className={classes.galleryContainer}>
                {/* Newly Added Section */}
                {newlyAddedPhotos.length > 0 && (
                    <>
                        <div style={{
                            textAlign: 'center',
                            color: '#ff6b6b',
                            paddingTop: '2rem',
                            paddingBottom: '1rem',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            ⭐ Newly Added Photos
                        </div>
                        <div className={classes.gallery} style={{ borderBottom: '2px solid #5f4d97', paddingBottom: '2rem' }}>
                            {renderGalleryItems(newlyAddedPhotos, 0)}
                        </div>
                    </>
                )}

                <div className={classes.header}>
                    Club Gallery
                </div>
                <div className={classes.gallery}>
                    {renderGalleryItems(allOtherPhotos, newlyAddedPhotos.length)}
                </div>
            </div>

            {/* Lightbox Modal */}
            {isModalOpen && selectedImageIndex !== null && (
                <div className={classes.modalOverlay} onClick={handleCloseModal}>
                    <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={allPhotos[selectedImageIndex].src}
                            alt={allPhotos[selectedImageIndex].alt}
                            className={classes.modalImage}
                        />
                        <button
                            className={`${classes.arrowButton} ${classes.leftArrow}`}
                            onClick={handlePrevImage}
                            title="Previous image"
                        >
                            <HiChevronLeft />
                        </button>
                        <button
                            className={`${classes.arrowButton} ${classes.rightArrow}`}
                            onClick={handleNextImage}
                            title="Next image"
                        >
                            <HiChevronRight />
                        </button>
                        <div className={classes.imageCounter}>
                            {selectedImageIndex + 1} / {allPhotos.length}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default GalleryPage;

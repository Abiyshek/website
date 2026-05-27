import React, { useContext, useRef, useState, useEffect } from 'react';

import Slider from 'react-slick';

import { FaQuoteLeft, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { ThemeContext } from '../../contexts/ThemeContext';
import { testimonialsData } from '../../data/testimonialsData';

import './Testimonials.css';

function Testimonials() {
    const { theme } = useContext(ThemeContext);
    const sliderRef = useRef();
    const [openModal, setOpenModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [testimonials, setTestimonials] = useState(testimonialsData);

    // Load edited testimonials from localStorage if available
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

    const handleOpenModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTestimonial(null);
    };

    const settings = {
        dots: true,
        adaptiveHeight: true,
        infinite: true,
        speed: 800,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        margin: 3,
        loop: true,
        autoplaySpeed: 3000,
        draggable: true,
        swipeToSlide: true,
        swipe: true,
    };

    const gotoNext = () => {
        sliderRef.current.slickNext();
    };

    const gotoPrev = () => {
        sliderRef.current.slickPrev();
    };

    return (
        <>
            {testimonials.length > 0 && (
                <div
                    id="testimonials"
                    className='testimonials'
                    style={{ backgroundColor: theme.primary }}
                >
                    <div className='testimonials--header'>
                        <h1 style={{ color: theme.secondary }}>Testimonials</h1>
                    </div>
                    <div className='testimonials--body'>
                        <FaQuoteLeft
                            className='quote'
                            style={{ color: theme.secondary }}
                        />
                        <div
                            className='testimonials--slider'
                            style={{ backgroundColor: theme.primary }}
                        >
                            <Slider {...settings} ref={sliderRef}>
                                {testimonials.map((test) => (
                                    <div
                                        className='single--testimony'
                                        key={test.id}
                                    >
                                        <div className='testimonials--container'>
                                            <div
                                                className='review--img'
                                                style={{
                                                    backgroundColor:
                                                        theme.secondary,
                                                }}
                                            >
                                                <img
                                                    src={test.image}
                                                    alt={test.name}
                                                />
                                            </div>
                                            <div
                                                className='review--content'
                                                style={{
                                                    backgroundColor:
                                                        theme.secondary,
                                                    color: theme.tertiary,
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s'
                                                }}
                                                onClick={() => handleOpenModal(test)}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <p>{test.text}</p>
                                                <h1>{test.name}</h1>
                                                <h4>{test.title}</h4>
                                                {test.fullText && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>👆 Click to read full story</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                            <button
                                className='prevBtn'
                                onClick={gotoPrev}
                                style={{ backgroundColor: theme.secondary }}
                            >
                                <FaArrowLeft
                                    style={{ color: theme.primary }}
                                    aria-label='Previous testimonial'
                                />
                            </button>
                            <button
                                className='nextBtn'
                                onClick={gotoNext}
                                style={{ backgroundColor: theme.secondary }}
                            >
                                <FaArrowRight
                                    style={{ color: theme.primary }}
                                    aria-label='Next testimonial'
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Story Modal */}
            <Dialog 
                open={openModal} 
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle style={{ backgroundColor: theme.primary, color: theme.secondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{selectedTestimonial?.name}</span>
                    <IconButton 
                        onClick={handleCloseModal}
                        size="small"
                        style={{ color: theme.secondary }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{ padding: '2rem 1.5rem' }}>
                    <h3 style={{ color: theme.primary, marginTop: '1rem' }}>{selectedTestimonial?.title}</h3>
                    <p style={{ fontSize: '1rem', lineHeight: '1.6', color: theme.tertiary, marginTop: '1rem' }}>
                        {selectedTestimonial?.fullText || selectedTestimonial?.text}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Testimonials;

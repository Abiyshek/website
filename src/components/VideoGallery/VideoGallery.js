import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { videoData } from '../../data/videoData';
import { HiArrowRight } from 'react-icons/hi';

const VideoGallery = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedVideo, setSelectedVideo] = useState(null);
    
    // Show first 4 videos on homepage
    const displayVideos = videoData.slice(0, 4);

    return (
        <div id="blog" style={{
            backgroundColor: theme?.secondary || '#030d2a',
            padding: '3rem 2rem',
            width: '100%',
            minHeight: 'auto'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{
                    color: theme?.primary || '#5f4d97',
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    margin: '0 0 3rem 0',
                    fontFamily: 'var(--primaryFont)',
                    textAlign: 'center'
                }}>
                    Video Gallery
                </h1>
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {displayVideos.map(video => (
                    <div
                        key={video.id}
                        style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(95, 77, 151, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => setSelectedVideo(video)}
                    >
                        <div style={{ position: 'relative' }}>
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                style={{
                                    width: '100%',
                                    height: '160px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '50px',
                                height: '50px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                color: '#5f4d97'
                            }}>
                                ▶
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {videoData.length > 4 && (
                <div style={{
                    maxWidth: '1200px',
                    margin: '2rem auto 0',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Link to="/video-gallery" style={{ textDecoration: 'none' }}>
                        <button style={{
                            color: theme?.secondary || '#030d2a',
                            backgroundColor: theme?.primary || '#5f4d97',
                            padding: '12px 28px',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme?.tertiary || '#3d2970';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = theme?.primary || '#5f4d97';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        >
                            View All
                            <HiArrowRight />
                        </button>
                    </Link>
                </div>
            )}

            {selectedVideo && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setSelectedVideo(null)}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '24px',
                            cursor: 'pointer',
                            zIndex: 1001
                        }}
                        onClick={() => setSelectedVideo(null)}
                    >
                        ✕
                    </button>
                    <iframe
                        style={{
                            width: '90%',
                            maxWidth: '900px',
                            height: '500px',
                            border: 'none'
                        }}
                        src={selectedVideo.videoUrl}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default VideoGallery;

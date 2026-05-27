import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { videoData } from '../../data/videoData';

const VideoGalleryPage = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Separate newly added videos
    const newlyAddedVideos = videoData.filter(v => v.isNew);
    const allOtherVideos = videoData.filter(v => !v.isNew);

    const renderVideoCard = (video) => (
        <div
            key={video.id}
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                backgroundColor: 'rgba(95, 77, 151, 0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                position: 'relative'
            }}
            onClick={() => setSelectedVideo(video)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0px 8px 25px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.2)';
            }}
        >
            {video.isNew && (
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
                    color: theme?.primary || '#5f4d97'
                }}>
                    ▶
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: theme?.secondary || '#030d2a', minHeight: '100vh', paddingTop: '100px' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Newly Added Section */}
                {newlyAddedVideos.length > 0 && (
                    <>
                        <h2 style={{
                            color: '#ff6b6b',
                            fontSize: '2rem',
                            fontWeight: 600,
                            marginBottom: '2rem',
                            textAlign: 'center',
                            fontFamily: 'var(--primaryFont)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            ⭐ Newly Added Videos
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '2rem',
                            maxWidth: '800px',
                            margin: '0 auto 3rem',
                            borderBottom: '2px solid #5f4d97',
                            paddingBottom: '3rem'
                        }}>
                            {newlyAddedVideos.map(video => renderVideoCard(video))}
                        </div>
                    </>
                )}

                {/* All Videos Section */}
                <h1 style={{
                    color: theme?.primary || '#5f4d97',
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    marginBottom: '3rem',
                    textAlign: 'center',
                    fontFamily: 'var(--primaryFont)'
                }}>
                    All Videos
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '2rem',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {allOtherVideos.map(video => renderVideoCard(video))}
                </div>
            </div>

            {selectedVideo && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
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
                            zIndex: 1001,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => setSelectedVideo(null)}
                    >
                        ✕
                    </button>
                    <video
                        style={{
                            width: '90%',
                            maxWidth: '900px',
                            height: '500px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#000'
                        }}
                        controls
                        autoPlay
                        onClick={(e) => e.stopPropagation()}
                    >
                        <source src={selectedVideo.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
};

export default VideoGalleryPage;

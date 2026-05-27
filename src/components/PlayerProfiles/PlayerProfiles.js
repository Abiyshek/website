import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playerProfilesData } from '../../data/playerProfilesData';
import { HiArrowRight } from 'react-icons/hi';
import './PlayerProfiles.css';

const PlayerProfiles = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const featuredNames = ['Arunesh', 'Dhuruva', 'Dhivyesh', 'Mithun', 'Samanatha', 'Anbuchelvi'];
    const displayProfiles = featuredNames
        .map(n => playerProfilesData.find(p => p.name === n))
        .filter(Boolean);

    return (
        <div style={{
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
                    Player Profiles
                </h1>
            </div>

            <div className="player-profiles-container">
                {displayProfiles.map((profile, index) => (
                    <div
                        key={profile.id}
                        className="player-card"
                        style={{
                            backgroundColor: theme?.primary || '#545fc4',
                            ...(index >= 4 && { gridColumn: index === 4 ? '2 / 3' : '3 / 4' })
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0px 8px 25px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.2)';
                        }}
                    >
                        <div 
                            style={{ position: 'relative', overflow: 'hidden', height: '250px', width: '100%', flex: '0 0 auto' }}
                            onClick={() => setSelectedPlayer(profile)}
                        >
                            <img
                                src={profile.image}
                                alt={profile.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center center',
                                    display: 'block',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                        <div style={{ padding: '1.5rem 1rem 0 1rem', flex: '1' }}>
                            <h3 style={{
                                color: '#fff',
                                fontSize: '1.3rem',
                                fontWeight: 600,
                                margin: '0.5rem -1rem 0 -1rem',
                                padding: '1rem',
                                fontFamily: 'var(--primaryFont)',
                                background: '#6366f1',
                                width: 'calc(100% + 2rem)'
                            }}>
                                {profile.name}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {playerProfilesData.length > 6 && (
                <div style={{
                    maxWidth: '1200px',
                    margin: '2rem auto 0',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Link to="/player-profiles" style={{ textDecoration: 'none' }}>
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

            {/* Full Image Modal */}
            {selectedPlayer && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme?.primary || '#545fc4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setSelectedPlayer(null)}
                >
                    <div 
                        style={{
                            position: 'relative',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedPlayer(null)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0, 0, 0, 0.6)',
                                border: 'none',
                                color: '#fff',
                                fontSize: '28px',
                                cursor: 'pointer',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10000,
                                transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                        >
                            ×
                        </button>
                        <div style={{ maxHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src={selectedPlayer.image}
                                alt={selectedPlayer.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                            <h2 style={{ color: '#000', margin: 0 }}>{selectedPlayer.name}</h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerProfiles;

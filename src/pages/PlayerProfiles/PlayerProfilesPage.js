import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playerProfilesData } from '../../data/playerProfilesData';

const PlayerProfilesPage = () => {
    const { theme } = useContext(ThemeContext);

    // Separate newly added players (assuming they have isNew property or are the last added)
    const newlyAddedPlayers = playerProfilesData.filter(p => p.isNew);
    const allOtherPlayers = playerProfilesData.filter(p => !p.isNew);

    const renderPlayerCard = (profile) => (
        <div
            key={profile.id}
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                backgroundColor: 'rgba(95, 77, 151, 0.1)',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                paddingBottom: '1.5rem',
                position: 'relative'
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
            {profile.isNew && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 10
                }}>
                    ⭐ NEW
                </div>
            )}
            <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                <img
                    src={profile.image}
                    alt={profile.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                    }}
                />
            </div>
            <div style={{ padding: '1.5rem 1rem 0 1rem' }}>
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
    );

    return (
        <div style={{ backgroundColor: theme?.secondary || '#030d2a', minHeight: '100vh', paddingTop: '100px' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Newly Added Section */}
                {newlyAddedPlayers.length > 0 && (
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
                            ⭐ Newly Added Players
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '2rem',
                            marginBottom: '4rem',
                            borderBottom: '2px solid #5f4d97',
                            paddingBottom: '3rem'
                        }}>
                            {newlyAddedPlayers.map(profile => renderPlayerCard(profile))}
                        </div>
                    </>
                )}

                {/* All Players Section */}
                <h1 style={{
                    color: theme?.primary || '#5f4d97',
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    marginBottom: '3rem',
                    textAlign: 'center',
                    fontFamily: 'var(--primaryFont)'
                }}>
                    All Players
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    {allOtherPlayers.map(profile => renderPlayerCard(profile))}
                </div>
            </div>
        </div>
    );
};

export default PlayerProfilesPage;

import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import './AchievementSummary.css';
import { ThemeContext } from '../../contexts/ThemeContext';
import { achievementData } from '../../data/achievementData'

function AchievementSummary() {

    const { theme } = useContext(ThemeContext);
    const history = useHistory();
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    const handleCardClick = (achievement) => {
        setSelectedAchievement(achievement);
    };

    const handleCloseModal = () => {
        setSelectedAchievement(null);
    };

    return (
        <>
            {achievementData.achievements.length > 0 && (
                <>
                    <div className="achievement-summary" id="achievement-summary" style={{backgroundColor: theme.secondary}}>
                        <div className="achievement-summary-header">
                            <h1 style={{color: theme.primary}}>Achievements</h1>
                        </div>
                        <div className="achievement-summary-cards">
                            {achievementData.achievements.slice(0, 3).map(achieve => ( 
                                <div 
                                    key={achieve.id}
                                    className="achievement-summary-card"
                                    style={{backgroundColor: '#6366f1'}}
                                    onClick={() => handleCardClick(achieve)}
                                >
                                    {achieve.image && (
                                        <div className="achievement-card-image">
                                            <img src={achieve.image} alt={achieve.title} />
                                        </div>
                                    )}
                                    {!achieve.image && (
                                        <div className="achievement-card-image-placeholder">
                                            <span>Add Image</span>
                                        </div>
                                    )}
                                    <h2 style={{color: '#ffffff'}}>{achieve.title}</h2>
                                    <div className="achievement-card-tooltip">
                                        <p>{achieve.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="achievement-summary-footer">
                            <button 
                                className="view-all-btn"
                                style={{backgroundColor: theme.primary, color: theme.secondary}}
                                onClick={() => history.push('/achievements')}
                            >
                                View All
                                <span style={{marginLeft: '0.5rem'}}>→</span>
                            </button>
                        </div>
                    </div>

                    {selectedAchievement && (
                        <div className="achievement-modal-overlay" onClick={handleCloseModal}>
                            <div 
                                className="achievement-modal"
                                style={{backgroundColor: theme.secondary}}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button 
                                    className="modal-close-btn"
                                    style={{color: theme.tertiary}}
                                    onClick={handleCloseModal}
                                >
                                    ✕
                                </button>
                                <div className="achievement-modal-content">
                                    <div className="modal-image">
                                        {selectedAchievement.image && (
                                            <img src={selectedAchievement.image} alt={selectedAchievement.title} />
                                        )}
                                    </div>
                                    <div className="modal-details">
                                        <h1 style={{color: theme.primary}}>{selectedAchievement.title}</h1>
                                        <p style={{color: theme.tertiary}}>{selectedAchievement.details}</p>
                                        <div className="modal-meta">
                                            <div className="meta-item">
                                                <span style={{color: theme.tertiary80}}>Date:</span>
                                                <span style={{color: theme.primary}}>{selectedAchievement.date}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span style={{color: theme.tertiary80}}>Category:</span>
                                                <span style={{color: theme.primary}}>{selectedAchievement.field}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default AchievementSummary


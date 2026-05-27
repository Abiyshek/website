import React, { useContext } from 'react';

import { ThemeContext } from '../../contexts/ThemeContext';

import './Education.css'
import EducationCard from './EducationCard';
import Gallery from '../Gallery/Gallery';

import { educationData } from '../../data/educationData'
import { eduBlack } from '../../theme/images'

function Education() {

    const { theme } = useContext(ThemeContext);
    return (
        <>
            <div className="education" id="resume" style={{backgroundColor: theme.secondary}}>
           
                <div className="education-body">
                    <div className="education-description">
                    <h1 style={{color:theme.primary}}>Facilities</h1>
                        {educationData.map(edu => (
                            <EducationCard 
                                key={edu.id}
                                id={edu.id}
                                institution={edu.institution}
                                course={edu.course}
                                description={edu.description}
                                startYear={edu.startYear}
                                endYear={edu.endYear}
                            />
                        ))}
                    </div>
                    <div className="education-image">
                        <img src={eduBlack} alt=""/>
                    </div>
                </div>
            </div>
            <Gallery />
        </>
    )
}

export default Education

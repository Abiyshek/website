import React,{useContext} from 'react';

import { ThemeContext } from '../../contexts/ThemeContext';

import './Experience.css';

import { experienceData } from '../../data/experienceData'
import ExperienceCard from './ExperienceCard';
import { expBlack } from '../../theme/images'

function Experience() {

    const { theme } = useContext(ThemeContext);
    return (
        <div className="experience" id="experience" style={{backgroundColor: theme.secondary}}> 
             <div className="experience-body">
                 <div className="experience-image">
                     <img src={expBlack} alt="" />
                 </div>
                 <div className="experience-description">
                    <h1 style={{color:theme.primary}}>Table Tennis Specific Drills</h1>
                    {experienceData.map(exp =>(
                        <ExperienceCard 
                            key={exp.id}
                            id={exp.id}
                            company={exp.company}
                            icon={exp.icon}
                            description={exp.description}/>
                    ))}
                 </div>
             </div>
        </div>
    )
}

export default Experience

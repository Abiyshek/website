import React,{useContext, useState} from 'react';
import Fade from 'react-reveal/Fade';

import { ThemeContext } from '../../../contexts/ThemeContext';

import './SingleService.css'


function SingleService({id, title, icon, image}) {

    const { theme } = useContext(ThemeContext);
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <Fade bottom>
            <div 
                key={id} 
                className={`single-service ${isFlipped ? 'flipped' : ''}`}
                style={{backgroundColor: isFlipped ? '#000' : theme.primary400}}
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
            >
                {!isFlipped ? (
                    <div className="service-content"  style={{color:theme.tertiary}}>
                        <i className="service-icon">{icon}</i>
                        <h4  style={{color:theme.tertiary}}>{title}</h4>  
                    </div>
                ) : (
                    <div className="service-image-content">
                        <img src={image} alt={title} className="service-image" />
                    </div>
                )}
            </div>
        </Fade>
    )
}

export default SingleService

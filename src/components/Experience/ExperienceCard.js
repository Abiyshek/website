import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fade from 'react-reveal/Fade';

import { ThemeContext } from '../../contexts/ThemeContext';

import './Experience.css'

function ExperienceCard({id, company, icon, description}) {

    const { theme } = useContext(ThemeContext);

    const useStyles = makeStyles((t) => ({
        experienceCard : {
            backgroundColor:theme.primary30,
            "&:hover": {
                backgroundColor:theme.primary50,
            },
        },
        iconWrapper: {
            fontSize: '2.5rem',
            color: theme.primary,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    }));

    const classes = useStyles();


    return (
        <Fade bottom>
            <div key={id} className={`experience-card ${classes.experienceCard}`}>
                <div className={classes.iconWrapper}>
                    {icon}
                </div>
                <div className="experience-details">
                    <h4 style={{color: theme.tertiary}}>{company}</h4>
                </div>
                <div className="experience-card-tooltip">
                    <p>{description}</p>
                </div>
            </div>
        </Fade>   
    )
}

export default ExperienceCard

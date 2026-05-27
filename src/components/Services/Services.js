import React,{useContext} from 'react';

import { ThemeContext } from '../../contexts/ThemeContext';

import { servicesData } from '../../data/servicesData';

import './Services.css'
import SingleService from './SingleService/SingleService';

function Services() {

    const { theme } = useContext(ThemeContext);
    return (
        <>
            {servicesData.length > 0 && (
                <div className="services" id="services" style={{backgroundColor:theme.secondary}}>
                    <div className="services-header">
                        <h1 style={{color: theme.primary}}>Services</h1>
                    </div>
                    <div className="services-body">
                        <p style={{color:theme.tertiary80}}>
                            Exclusive training sessions designed to elevate your table tennis skills. From strategy and technique to mental fitness!
                        </p>
                        <div className="services-bodycontainer">
                            {servicesData.map(services => (
                                <SingleService
                                key={services.id}
                                id={services.id}
                                title={services.title}
                                icon={services.icon}
                                image={services.image}/>
                            ))}
                        </div>
                    </div>
                </div>
            )}
       </>
    )
}

export default Services

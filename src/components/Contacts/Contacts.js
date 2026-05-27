import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    FaYoutube,
    FaInstagram,
    FaWhatsapp,
} from 'react-icons/fa';
import { FiPhone, FiAtSign } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import { ThemeContext } from '../../contexts/ThemeContext';

import { socialsData } from '../../data/socialsData';
import { contactsData } from '../../data/contactsData';
import { contactsBlack } from '../../theme/images';
import qrCode from '../../assets/qr/Untitled QR code.png';
import './Contacts.css';

function Contacts() {
    const { theme } = useContext(ThemeContext);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
        const coarsePointer =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(pointer: coarse)').matches;
        setIsMobile(mobileUA || coarsePointer);
    }, []);

    const phoneDigits = (contactsData.phone || '').replace(/[^\d]/g, '');
        ? `tel:${contactsData.phone}`
        : `https://wa.me/${phoneDigits}`;

    const useStyles = makeStyles(() => ({
        socialIcon: {
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '21px',
            backgroundColor: theme.primary,
            color: theme.secondary,
            transition: '250ms ease-in-out',
            '&:hover': {
                transform: 'scale(1.1)',
                color: theme.secondary,
                backgroundColor: theme.tertiary,
            },
        },
        detailsIcon: {
            backgroundColor: theme.primary,
            color: theme.secondary,
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '23px',
            transition: '250ms ease-in-out',
            flexShrink: 0,
            '&:hover': {
                transform: 'scale(1.1)',
                color: theme.secondary,
                backgroundColor: theme.tertiary,
            },
        },
    }));

    const classes = useStyles();

    return (
        <div
            className='contacts'
            id='contacts'
            style={{ backgroundColor: theme.secondary }}
        >
            <div className='contacts--container'>
                <h1 style={{ color: theme.primary }}>Contacts</h1>
                <div className='contacts-body'>
                    <div className='contacts-details'>
                        <a
                            href={`mailto:${contactsData.email}`}
                            className='personal-details'
                        >
                            <div className={classes.detailsIcon}>
                                <FiAtSign />
                            </div>
                            <p style={{ color: theme.tertiary }}>
                                {contactsData.email}
                            </p>
                        </a>
                        <a
                            href={`tel:${contactsData.phone}`}
                            className='personal-details'
                        >
                            <div className={classes.detailsIcon}>
                                <FiPhone />
                            </div>
                            <p style={{ color: theme.tertiary }}>
                                {contactsData.phone}
                            </p>
                        </a>
                        <a
                            href={`https://wa.me/${phoneDigits}`}
                            target='_blank'
                            rel='noreferrer'
                            className='personal-details'
                        >
                            <div className={classes.detailsIcon}>
                                <FaWhatsapp />
                            </div>
                            <p style={{ color: theme.tertiary }}>
                                WhatsApp
                            </p>
                        </a>
                        <div className='personal-details'>
                            <div className={classes.detailsIcon}>
                                <HiOutlineLocationMarker />
                            </div>
                            <p style={{ color: theme.tertiary }}>
                                {contactsData.address}
                            </p>
                        </div>

                        <div className='socialmedia-icons'>
                            {socialsData.instagram && (
                                <a
                                    href={socialsData.instagram}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaInstagram aria-label='Instagram' />
                                </a>
                            )}
                            {socialsData.youtube && (
                                <a
                                    href={socialsData.youtube}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaYoutube aria-label='YouTube' />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className='contacts-qr'>
                        <img
                            src={qrCode}
                            alt='QR Code'
                            className='qr-image'
                        />
                    </div>
                </div>
            </div>
            <img
                src={contactsBlack}
                alt='contacts'
                className='contacts--img'
            />
        </div>
    );
}

export default Contacts;

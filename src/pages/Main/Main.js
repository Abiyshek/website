import React from 'react'
import { Helmet } from 'react-helmet'

import { Navbar, Footer, Landing, About, Testimonials, Education, Experience, Contacts, Services, VideoGallery, PlayerProfiles, AchievementSummary } from '../../components'
import { headerData } from '../../data/headerData'

function Main() {
    return (
        <div>
            <Helmet>
                <title>{headerData.name} - Porfolio</title>
            </Helmet>

            <Navbar />        
            <Landing />
            <About />
            <Education />
            <Experience />
            <AchievementSummary />
            <Services />
            <VideoGallery />
            <PlayerProfiles />
            <Testimonials />
            <Contacts />
            <Footer />
        </div>
    )
}

export default Main

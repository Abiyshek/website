import React from 'react'
import { Helmet } from 'react-helmet'

import { Navbar, Footer, Achievement } from '../../components'
import { headerData } from '../../data/headerData'

function AchievementPage() {
    return (
        <div>
            <Helmet>
                <title>Achievements - {headerData.name}</title>
            </Helmet>

            <Navbar />        
            <Achievement />
            <Footer />
        </div>
    )
}

export default AchievementPage

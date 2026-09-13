import React from 'react'
import { Helmet } from 'react-helmet'

import { Navbar, Footer, FixtureGenerator } from '../../components'
import { headerData } from '../../data/headerData'

function FixturesPage() {
    return (
        <div>
            <Helmet>
                <title>Fixtures &amp; Draws - {headerData.name}</title>
            </Helmet>

            <Navbar />
            <FixtureGenerator />
            <Footer />
        </div>
    )
}

export default FixturesPage

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { ThemeContext } from './contexts/ThemeContext';
import { Main, GalleryPage, AchievementPage, VideoGalleryPage, PlayerProfilesPage, TestimonialsEditor } from './pages'
import { BackToTop } from './components'
import ScrollToTop from './utils/ScrollToTop'

import './App.css'

function App() {

  const { theme } = useContext(ThemeContext);

  console.log("%cDEVELOPER PORTFOLIO", `color:${theme.primary}; font-size:50px`);
  console.log("%chttps://github.com/hhhrrrttt222111/developer-portfolio", `color:${theme.tertiary}; font-size:20px`);
  // console.log = console.warn = console.error = () => {};

  return (
    <div className="app">
      <div className="floating-shape floating-shape-1"></div>
      <div className="floating-shape floating-shape-2"></div>
      <div className="floating-shape floating-shape-3"></div>
      <Router>
        <ScrollToTop/>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/gallery" exact component={GalleryPage} />
          <Route path="/achievements" exact component={AchievementPage} />
          <Route path="/video-gallery" exact component={VideoGalleryPage} />
          <Route path="/player-profiles" exact component={PlayerProfilesPage} />
          <Route path="/edit-testimonials" exact component={TestimonialsEditor} />

          <Redirect to="/" />
        </Switch>
      </Router>
      <BackToTop />
    </div>
  );
}

export default App;

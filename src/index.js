import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeContextProvider from './contexts/ThemeContext'
import logo from './assets/logo/WhatsApp Image 2026-05-26 at 18.59.55.jpeg';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Set favicon to club logo
const setFavicon = () => {
  const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = logo;
  document.head.appendChild(favicon);
  
  const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") || document.createElement('link');
  appleTouchIcon.rel = 'apple-touch-icon';
  appleTouchIcon.href = logo;
  document.head.appendChild(appleTouchIcon);
};

setFavicon();

ReactDOM.render(
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>,
  document.getElementById('root')
);


reportWebVitals();

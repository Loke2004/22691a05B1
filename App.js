import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoggingProvider } from './context/LoggingContext';
import { URLProvider } from './context/URLContext';
import StatisticsPage from './pages/StatisticsPage';
import URLShortenerForm from './components/URLShortenerForm';
import URLStatistics from './components/URLStatistics';
import RedirectHandler from './components/RedirectHandler';

function App() {
  return (
    <LoggingProvider>
      <URLProvider>
        <Router>
          <Routes>
            <Route path="/" element={<URLShortenerForm />} />
            <Route path="/stats" element={<URLStatistics />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
            <Route path="/statistics" element={<StatisticsPage />} />

          </Routes>
        </Router>
      </URLProvider>
    </LoggingProvider>
  );
}

export default App;
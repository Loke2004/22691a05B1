import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useURL } from '../context/URLContext';
import { useLogger } from '../context/LoggingContext';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const { urls, addClick } = useURL();
  const { log } = useLogger();
  const navigate = useNavigate();

  useEffect(() => {
    const urlEntry = urls.find(u => u.shortcode === shortcode);
    if (urlEntry) {
      const now = new Date();
      if (now <= new Date(urlEntry.expiresAt)) {
        addClick(shortcode, {
          timestamp: now.toISOString(),
          source: 'direct', // mock source
          location: 'unknown' // you can extend this with geo
        });
        log('INFO', 'Redirected', { shortcode });
        window.location.href = urlEntry.longURL;
      } else {
        alert('Link expired.');
        navigate('/');
      }
    } else {
      alert('Shortcode not found.');
      navigate('/');
    }
  }, [shortcode, urls, addClick, log, navigate]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;

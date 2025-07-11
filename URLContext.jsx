import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const URLContext = createContext();

export const useURL = () => useContext(URLContext);

export const URLProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);

  const addURL = (longURL, shortcode, validity) => {
    const now = new Date();
    const expiry = new Date(now.getTime() + validity * 60000);

    const urlData = {
      id: uuidv4(),
      longURL,
      shortcode,
      createdAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      clicks: []
    };

    setUrls(prev => [...prev, urlData]);

    return urlData;
  };

  const addClick = (shortcode, clickMeta) => {
    setUrls(prev => prev.map(url => {
      if (url.shortcode === shortcode) {
        return {
          ...url,
          clicks: [...url.clicks, clickMeta]
        };
      }
      return url;
    }));
  };

  return (
    <URLContext.Provider value={{ urls, addURL, addClick }}>
      {children}
    </URLContext.Provider>
  );
};

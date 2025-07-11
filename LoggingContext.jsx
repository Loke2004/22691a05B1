import React, { createContext, useContext } from 'react';

const LoggingContext = createContext();

export const useLogger = () => useContext(LoggingContext);

export const LoggingProvider = ({ children }) => {
  const log = (level, message, meta = {}) => {
    // Example: Custom logging logic
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    };
    // Save to localStorage or IndexedDB instead of console.log
    let logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('logs', JSON.stringify(logs));
  };

  return (
    <LoggingContext.Provider value={{ log }}>
      {children}
    </LoggingContext.Provider>
  );
};

import React from 'react';
import { Container, Typography } from '@mui/material';
import { useURL } from '../context/URLContext';
import URLList from './URLList';

const URLStatistics = () => {
  const { urls } = useURL();

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>URL Statistics</Typography>
      <URLList urls={urls} />

      <Typography variant="h6" mt={4}>Click Details</Typography>
      {urls.length === 0 && (
        <Typography>No URLs to display.</Typography>
      )}
      {urls.map(url => (
        <div key={url.id}>
          <Typography variant="subtitle1" mt={2}>
            {window.location.origin}/{url.shortcode} - Clicks: {url.clicks.length}
          </Typography>
          {url.clicks.length === 0 && <Typography variant="body2">No clicks recorded.</Typography>}
          {url.clicks.map((click, idx) => (
            <Typography key={idx} variant="body2" sx={{ ml: 2 }}>
              • {new Date(click.timestamp).toLocaleString()} | Source: {click.source} | Location: {click.location}
            </Typography>
          ))}
        </div>
      ))}
    </Container>
  );
};

export default URLStatistics;

import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const StatisticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/statistics');
        setUrls(response.data.urls);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>URL Statistics</Typography>

      {loading ? (
        <CircularProgress />
      ) : urls.length === 0 ? (
        <Typography>No URLs to display.</Typography>
      ) : (
        urls.map(url => (
          <div key={url._id}>
            <Typography variant="subtitle1" mt={2}>
              <a href={`${window.location.origin}/${url.shortcode}`} target="_blank" rel="noopener noreferrer">
                {window.location.origin}/{url.shortcode}
              </a> - Clicks: {url.clicks.length}
            </Typography>
            <Typography variant="body2">
              Long URL: <a href={url.longURL} target="_blank" rel="noopener noreferrer">{url.longURL}</a>
            </Typography>
            <Typography variant="body2">
              Created At: {new Date(url.createdAt).toLocaleString()} | Expires At: {new Date(url.expiresAt).toLocaleString()}
            </Typography>
            {url.clicks.length === 0 && <Typography variant="body2">No clicks recorded.</Typography>}
            {url.clicks.map((click, idx) => (
              <Typography key={idx} variant="body2" sx={{ ml: 2 }}>
                • {new Date(click.timestamp).toLocaleString()} | Source: {click.source} | Location: {click.location}
              </Typography>
            ))}
          </div>
        ))
      )}
    </Container>
  );
};

export default StatisticsPage;

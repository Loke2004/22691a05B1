import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URLList = ({ urls }) => {
  const navigate = useNavigate();

  return (
    <Box mt={2}>
      {urls.length === 0 && (
        <Typography variant="body1">No URLs shortened yet.</Typography>
      )}
      {urls.map(url => (
        <Box
          key={url.id}
          mb={2}
          p={2}
          border="1px solid #ccc"
          borderRadius="8px"
          bgcolor="#f9f9f9"
        >
          <Typography variant="subtitle1">
            <strong>Original:</strong> {url.longURL}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Short URL:</strong>{' '}
            <Link
              component="button"
              onClick={() => navigate(`/${url.shortcode}`)}
              underline="hover"
            >
              {window.location.origin}/{url.shortcode}
            </Link>
          </Typography>
          <Typography variant="body2">
            <strong>Created:</strong> {new Date(url.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Expires:</strong> {new Date(url.expiresAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Clicks:</strong> {url.clicks.length}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default URLList;

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useURL } from '../context/URLContext';
import { useLogger } from '../context/LoggingContext';
import { v4 as uuidv4 } from 'uuid';
import URLList from './URLList';

const URLShortenerForm = () => {
  const { addURL, urls } = useURL();
  const { log } = useLogger();

  const [entries, setEntries] = useState([
    { longURL: '', validity: '', shortcode: '' }
  ]);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleAdd = () => {
    if (entries.length < 5) {
      setEntries([...entries, { longURL: '', validity: '', shortcode: '' }]);
    }
  };

  const handleShorten = () => {
    entries.forEach(entry => {
      try {
        const url = new URL(entry.longURL); // validate
        const validity = entry.validity ? parseInt(entry.validity) : 30;

        if (isNaN(validity) || validity <= 0) {
          throw new Error('Invalid validity period.');
        }

        let shortcode = entry.shortcode.trim();
        if (!shortcode) {
          shortcode = uuidv4().slice(0, 6);
        } else {
          // Validate shortcode: alphanumeric and reasonable length
          if (!/^[a-zA-Z0-9]{3,12}$/.test(shortcode)) {
            throw new Error('Shortcode must be alphanumeric (3-12 chars).');
          }
        }

        if (urls.find(u => u.shortcode === shortcode)) {
          throw new Error('Shortcode already exists.');
        }

        addURL(url.href, shortcode, validity);
        log('INFO', 'URL shortened', { shortcode });

      } catch (err) {
        log('ERROR', 'Validation failed', { error: err.message });
        alert(`Error: ${err.message}`);
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {entries.map((entry, idx) => (
        <Box key={idx} mb={2}>
          <TextField
            label="Long URL"
            fullWidth
            margin="normal"
            value={entry.longURL}
            onChange={e => handleChange(idx, 'longURL', e.target.value)}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            margin="normal"
            fullWidth
            value={entry.validity}
            onChange={e => handleChange(idx, 'validity', e.target.value)}
          />
          <TextField
            label="Custom Shortcode (optional)"
            margin="normal"
            fullWidth
            value={entry.shortcode}
            onChange={e => handleChange(idx, 'shortcode', e.target.value)}
          />
        </Box>
      ))}
      <Box mt={2}>
        <Button variant="outlined" onClick={handleAdd} disabled={entries.length >= 5}>
          Add Another
        </Button>
        <Button variant="contained" onClick={handleShorten} sx={{ ml: 2 }}>
          Shorten
        </Button>
      </Box>

      <Typography variant="h5" mt={4}>Shortened URLs</Typography>
      <URLList urls={urls} />
    </Container>
  );
};

export default URLShortenerForm;
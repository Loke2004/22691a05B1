const express = require('express');
const router = express.Router();
const URL = require('../models/URL');
const logger = require('../middleware/logger');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const geoip = require('geoip-lite');

// POST /api/shorten
router.post('/shorten', async (req, res) => {
    try {
        const { longURL, validity, shortcode } = req.body;

        if (!validator.isURL(longURL, { require_protocol: true })) {
            logger('ERROR', 'Invalid URL provided', { longURL });
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const validMinutes = validity ? parseInt(validity) : 30;
        if (isNaN(validMinutes) || validMinutes <= 0) {
            logger('ERROR', 'Invalid validity period', { validity });
            return res.status(400).json({ error: 'Invalid validity period' });
        }

        let finalShortcode = shortcode ? shortcode.trim() : '';
        if (finalShortcode) {
            if (!/^[a-zA-Z0-9]{3,12}$/.test(finalShortcode)) {
                logger('ERROR', 'Invalid shortcode format', { shortcode });
                return res.status(400).json({ error: 'Shortcode must be alphanumeric (3-12 chars).' });
            }
            const exists = await URL.findOne({ shortcode: finalShortcode });
            if (exists) {
                logger('ERROR', 'Shortcode already exists', { shortcode });
                return res.status(400).json({ error: 'Shortcode already exists' });
            }
        } else {
            let unique = false;
            while (!unique) {
                finalShortcode = uuidv4().slice(0, 6);
                const exists = await URL.findOne({ shortcode: finalShortcode });
                if (!exists) unique = true;
            }
        }

        const expiresAt = new Date(Date.now() + validMinutes * 60000);

        const newURL = new URL({
            longURL,
            shortcode: finalShortcode,
            expiresAt
        });
        await newURL.save();

        logger('INFO', 'URL shortened', { shortcode: finalShortcode });

        res.json({
            message: 'URL shortened successfully',
            shortcode: finalShortcode,
            longURL,
            createdAt: newURL.createdAt,
            expiresAt
        });

    } catch (err) {
        logger('ERROR', 'Server error on /shorten', { error: err.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /:shortcode
router.get('/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        const urlEntry = await URL.findOne({ shortcode });

        if (!urlEntry) {
            logger('ERROR', 'Shortcode not found', { shortcode });
            return res.status(404).send('Short URL not found');
        }

        if (new Date() > urlEntry.expiresAt) {
            logger('INFO', 'Attempt to access expired link', { shortcode });
            return res.status(410).send('Link expired');
        }

        const source = req.get('referer') || 'direct';
        const ip = req.ip;
        const geo = geoip.lookup(ip) || { city: 'unknown', country: 'unknown' };
        const location = `${geo.city}, ${geo.country}`;

        urlEntry.clicks.push({
            source,
            location
        });
        await urlEntry.save();

        logger('INFO', 'Redirection', { shortcode, source, location });

        res.redirect(urlEntry.longURL);
    } catch (err) {
        logger('ERROR', 'Server error on redirect', { error: err.message });
        res.status(500).send('Internal server error');
    }
    router.get('/api/statistics', async (req, res) => {
    try {
        const urls = await URL.find().sort({ createdAt: -1 });
        res.json({ urls });
    } catch (err) {
        logger('ERROR', 'Error fetching statistics', { error: err.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

});

module.exports = router;

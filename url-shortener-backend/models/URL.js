const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    source: String,
    location: String
});

const urlSchema = new mongoose.Schema({
    longURL: { type: String, required: true },
    shortcode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    clicks: [clickSchema]
});

module.exports = mongoose.model('URL', urlSchema);

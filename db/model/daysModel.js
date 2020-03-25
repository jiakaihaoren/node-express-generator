const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Array },
  keywords: { type: Array },
  details: { type: String, required: true },
  images: { type: Array },
  videos: { type: Array },
});

const Days = mongoose.model('days', userSchema);

module.exports = Days;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Number, required: true },
  keywords: { type: Array, required: true },
  details: { type: String, required: true },
  images: { type: Array, required: true },
  videos: { type: Array, required: true },
});

const Days = mongoose.model('days', userSchema);

module.exports = Days;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  us: { type: String, required: true },
  ps: { type: String, required: true },
});

const Users = mongoose.model('users', userSchema);

module.exports = Users;

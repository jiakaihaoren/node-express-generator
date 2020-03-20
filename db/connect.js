const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jkzzj',{ useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connect mongodb successfully');
});
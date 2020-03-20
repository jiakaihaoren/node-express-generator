const express = require('express');

const router = express.Router();
const { userRes } = require('../utils/response')

/* test router. */
router.get('/', (req, res) => {
  res.send(userRes(0, 'test'))
});

module.exports = router;

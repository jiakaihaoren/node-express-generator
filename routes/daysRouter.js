const express = require('express');

const router = express.Router();
const DaysModel = require('../db/model/daysModel')
const { userRes } = require('../utils/response')

/* test router. */
router.get('/', (req, res) => {
  DaysModel.find()
    .then((data) => {
      console.log(data);
      res.send(userRes(0, data))
    })
    .catch((err) => {
      console.log(err);
      res.send(userRes(-1, '获取数据失败'))
    })
});

module.exports = router;

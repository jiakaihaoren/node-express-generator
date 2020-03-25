const express = require('express');

const router = express.Router();
const DaysModel = require('../db/model/daysModel')
const { userRes } = require('../utils/response')

// 获取所有days
router.get('/all', (req, res) => {
  DaysModel.find()
    .then((data) => {
      res.send(userRes(0, '获取数据成功', data))
    })
    .catch((err) => {
      console.log(err);
      res.send(userRes(-1, '获取数据失败'))
    })
});
// 按name查询days
router.get('/search', (req, res) => {
  const { name } = req.query
  if (name) {
    DaysModel.find({ name })
      .then((data) => {
        res.send(userRes(0, '获取数据成功', data))
      })
      .catch((err) => {
        console.log(err);
        res.send(userRes(-1, '获取数据失败'))
      })
  } else {
    res.send(userRes(-2, '请输入name查询'))
  }
});
// 添加days
router.post('/add', (req, res) => {
  const {
    name, date, keywords, details, images, videos,
  } = req.body
  if (!name) {
    res.send(userRes(-1, '名字不能为空'))
    return
  }
  DaysModel.insertMany({
    name,
    details: details || '',
    date,
    keywords,
    images,
    videos,
  })
    .then((data) => {
      if (data.length > 0) {
        res.send(userRes(0, '添加成功'))
      } else {
        res.send(userRes(-2, '添加失败，请重试'))
      }
    })
    .catch((err) => {
      console.log(err);
      res.send(userRes(-3, '服务器内部错误'))
    })
});

// 删除days
router.get('/delete', (req, res) => {
  const { id } = req.query
  DaysModel.deleteOne({ _id: id })
    .then((data) => {
      if (data.deletedCount > 0) {
        res.send(userRes(0, '删除成功'))
      } else {
        res.send(userRes(-1, '删除失败，请重试'))
      }
    })
    .catch((err) => {
      console.log(err);
      res.send(userRes(-2, '删除失败，请重试'))
    })
});

// 修改days
router.post('/update', (req, res) => {
  const {
    _id, name, date, keywords, details, images, videos,
  } = req.body
  const updateObj = {
    name, date, keywords, details, images, videos,
  }
  // 防止未定义或空的值修改数据库的值
  Object.keys(updateObj).forEach((key) => {
    const element = updateObj[key];
    if (typeof element === 'undefined' || element === null) {
      delete updateObj[key]
    }
  })
  DaysModel.updateOne({ _id }, updateObj)
    .then((data) => {
      if (data.nModified > 0) {
        res.send(userRes(0, '更新成功'))
      } else {
        res.send(userRes(-1, '更新失败，请重试'))
      }
    })
    .catch((err) => {
      console.log(err);
      res.send(userRes(-2, '更新失败，请重试'))
    })
});

module.exports = router;

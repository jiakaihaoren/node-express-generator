const express = require('express');
const path = require('path')
const fs = require('fs')
const multer = require('multer');
const { userRes } = require('../utils/response')

const router = express.Router();

// 设置保存规则
const storage = (type) => multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, `../public/${type}`))
  },
  filename(req, file, cb) {
    const [filename, ext] = file.originalname.split('.')
    cb(null, `${filename}-${Date.now()}.${ext}`)
  },
})
// 设置image过滤规则（可选）
const fileFilter = (type) => (req, file, cb) => {
  const acceptableImagesMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  const acceptableVideosMime = ['video/mp4', 'video/ogg', 'video/webm']
  if (type === 'images') {
    if (acceptableImagesMime.indexOf(file.mimetype) !== -1) {
      cb(null, true)
    } else {
      cb(new Error('文件类型错误'), false)
    }
  } else if (acceptableVideosMime.indexOf(file.mimetype) !== -1) {
    cb(null, true)
  } else {
    cb(new Error('文件类型错误'), false)
  }
}
// 设置限制（可选）
const imageLimits = {
  fieldSize: '10MB',
}
const videoLimits = {
  fieldSize: '50MB',
}

const uploadImages = multer({
  storage: storage('images'),
  fileFilter: fileFilter('images'),
  imageLimits,
})

const uploadVideos = multer({
  storage: storage('videos'),
  fileFilter: fileFilter('videos'),
  videoLimits,
})
// 上传图片
router.post('/images', uploadImages.array('images'), (req, res) => {
  if (!req.files) {
    res.send(userRes(-1, '上传失败'))
    return;
  }
  res.send(userRes(0, '上传成功', { urls: req.files.map((file) => `/images/${file.filename}`) }))
})

const deleteSourcePromise = (url) => new Promise((resolve, reject) => {
  fs.unlink(path.resolve(__dirname, `../public${url}`), (error) => {
    if (error) {
      reject(new Error(`资源 ${url} 删除失败`))
    }
    resolve(`资源 ${url} 删除成功`)
  })
})
// 上传视频
router.post('/videos', uploadVideos.array('videos'), (req, res) => {
  if (!req.files) {
    res.send(userRes(-1, '上传失败'))
    return;
  }
  res.send(userRes(0, '上传成功', { urls: req.files.map((file) => `/videos/${file.filename}`) }))
})
// 删除资源
router.post('/delete', (req, res) => {
  const { urls } = req.body
  if (urls) {
    const deletesPromises = urls.map((url) => deleteSourcePromise(url))
    Promise.all(deletesPromises)
      .then((data) => {
        console.log(data);
        res.send(userRes(0, '资源删除成功'))
      })
      .catch((err) => {
        console.log(err);
        res.send(userRes(-1, err.message))
      })
  } else {
    res.send(userRes(-2, '请输入资源路径'))
  }
})

module.exports = router

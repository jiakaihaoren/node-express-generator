/* 用户登录登出路由 */
const express = require('express');

const router = express.Router();
const usersModel = require('../db/model/usersModel')
const { userRes } = require('../utils/response')
/**
 * @api {post} /users/login 用户登录接口
 * @apiName usersLogin
 * @apiGroup users
 *
 * @apiParam {String} us 用户名.
 * @apiParam {String} ps 密码.
 *
 * @apiSuccess {Number} err 返回状态码.
 * @apiSuccess {String} msg 返回信息.
 */
router.post('/login', (req, res) => {
  const { us, ps } = req.body
  if (!us || !ps) {
    res.send(userRes(-1, '请输入用户名的密码'));
  } else {
    usersModel.find({ us, ps })
      .then((data) => {
        if (data.length > 0) {
          req.session.login = true
          req.session.userName = us
          res.send(userRes(0, '登录成功'));
        } else {
          res.send(userRes(-2, '用户名或密码错误'));
        }
      })
      .catch((err) => {
        console.warn(err);
        res.send(userRes(-3, '查询数据库错误'));
      })
  }
});
/**
 * @api {get} /users/logout 用户登出接口
 * @apiName usersLogout
 * @apiGroup users
 *
 * @apiSuccess {Number} err 返回状态码.
 * @apiSuccess {String} msg 返回信息.
 */
router.get('/logout', (req, res) => {
  const { login } = req.session
  if (login) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.send(userRes(-1, '登出失败，请重试'))
      } else {
        res.send(userRes(0, '登出成功'))
      }
    })
  } else {
    res.send(userRes(-998, '未登录，请先登录'))
  }
});

module.exports = router;

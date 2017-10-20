/**
 * Created by ADMIN on 5/29/2017.
 */
const express = require('express');
const router = express.Router();

const Device = require('../app/controllers/http/device');
const DeviceLog = require('../app/controllers/http/deviceLog');
const User = require('../app/controllers/http/user');
const UserGroup = require('../app/controllers/http/userGroup');
const DeviceUserMap = require('../app/controllers/http/deviceUserMap');
const ErrorLog = require('../app/controllers/http/errorLog');
const TestC = require('../app/controllers/http/test');

router.get('/verify/:username/:key', function (req, res, next) {
  res.render('index', { title: 'Verify' });
});

router.get('/test', function (req, res, next) {
  TestC.Test(req, res, next)
});

router.post('/auth', function (req, res, next) {
  User.auth(req, res, next)
});

router.post('user/create', function (req, res, next) {
  User.create(req, res, next)
});

router.get('/user/get', function (req, res, next) {
  User.get(req, res, next)
});

router.post('/user/delete', function (req, res, next) {
  User.delete(req, res, next)
});

router.post('/user/update', function (req, res, next) {
  User.update(req, res, next)
});

router.get('/user/getPagi', function (req, res, next) {
  User.getPagi(req, res, next)
});

router.post('/user/searchMultiple', function (req, res, next) {
  User.searchMultiple(req, res, next)
});

router.post('/user/register', function (req, res, next) {
  User.register(req, res, next)
});

router.post('/user/verify', function (req, res, next) {
  User.verify(req, res, next)
});

router.post('/deviceUser/register', function (req, res, next) {
  DeviceUserMap.register(req, res, next)
});

router.post('/deviceUser/add', function (req, res, next) {
  DeviceUserMap.add(req, res, next)
});

router.post('/deviceUser/move', function (req, res, next) {
  DeviceUserMap.move(req, res, next)
});

router.post('/deviceUser/remove', function (req, res, next) {
  DeviceUserMap.remove(req, res, next)
});

router.post('/device/getPagi', function (req, res, next) {
  Device.getPagi(req, res, next)
});

router.post('/device/searchMultiple', function (req, res, next) {
  Device.searchMultiple(req, res, next)
});

router.post('/device/add', function (req, res, next) {
  Device.add(req, res, next)
});

router.get('/device/get', function (req, res, next) {
  Device.get(req, res, next)
});

router.post('/deviceLog/searchMultiple', function (req, res, next) {
  DeviceLog.searchMultiple(req, res, next)
});

router.get('/userGroup/getAll', function (req, res, next) {
  UserGroup.getAll(req, res, next)
});

router.post('/errorLog/getAll', function (req, res, next) {
  ErrorLog.getAll(req, res, next)
});

module.exports = router;


const Device = require('../../../repository/mysql/Device');
const DeviceUserMap = require('../../../repository/mysql/DeviceUserMap');
const response = require('../../../libs/response');
const resCode = require('../../../utilities/response/code');
const resMessage = require('../../../utilities/response/message');
const jwt = require('../../../libs/jwt');
const define = require('../../../global/define');

module.exports = {
  add: function (req, res, next) {
    if (req.body.imei === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      /*jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {*/
          Device.find({imei: req.body.imei}, (err, result) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (result.length > 0) {
                return response.FAIL(res, resCode.DEVICE_EXISTS, resMessage.DEVICE_EXISTS, null)
              }
              else {
                Device.create({imei: req.body.imei, status: define.INACTIVE, state: define.OFF}, err => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                  }
                })
              }
            }
          })
        /*}
        else {
          res.json(result)
        }
      })*/
    }
  },
  getPagi: function (req, res, next) {
    if (req.body.page === undefined || req.body.size === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          Device.findPagi({}, {
            limit: parseInt(req.body.size),
            offset: (parseInt(req.body.page) - 1)*parseInt(req.body.size)
          }, (err, device_f, total) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              return response.OK_PAGI(res, resCode.SUCCESS, resMessage.SUCCESS, device_f, total)
            }
          })
        }
        else {
          res.json(result)
        }
      })
    }
  },
  searchMultiple: function (req, res, next) {
   /* jwt.checkToken(req.get('Authorization'), result => {
      if (result.status) {*/
        Device.searchMultiple({
          imei: req.body.imei, name: req.body.name,
          startDate: req.body.startDate, endDate: req.body.endDate,
          status: req.body.status, limit: req.body.page_size, offset: (req.body.page_num -1)*req.body.page_size
        }, (err, device_f, total) => {
          if (err) {
            return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
          }
          else {
            return response.OK_PAGI(res, resCode.SUCCESS, resMessage.SUCCESS, device_f, total)
          }
        })
      /*}
      else {
        res.json(result)
      }
    })*/
  },
  get: function (req, res, next) {
    if (req.query.imei === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          Device.find({imei: req.query.imei}, (err, device_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (device_f.length > 0) {
                let data = {};
                DeviceUserMap.findJoin(['user'], {deviceId: device_f[0].device_id, 'device_user_map.status': define.ACTIVE}, {}, false,
                  (err, deviceUserMap_f) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    data.device = device_f[0];
                    data.user = deviceUserMap_f;
                    return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, data)
                  }
                })
              }
              else {
                return response.FAIL(res, resCode.DEVICE_NOT_FOUND, resMessage.DEVICE_NOT_FOUND, null)
              }
            }
          })
        }
        else {
          res.json(result)
        }
      })
    }
  }
};

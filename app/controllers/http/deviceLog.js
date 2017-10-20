/**
 * Created by ADMIN on 9/6/2017.
 */

const DeviceLog = require('../../../repository/mysql/DeviceLog');
const response = require('../../../libs/response');
const resCode = require('../../../utilities/response/code');
const resMessage = require('../../../utilities/response/message');
const jwt = require('../../../libs/jwt');

module.exports = {
  searchMultiple: function (req, res, next) {
    /*jwt.checkToken(req.get('Authorization'), result => {
      if (result.status) {*/
        DeviceLog.searchMultiple({
          imei: req.body.imei, name: req.body.name,
          startDate: req.body.startDate, endDate: req.body.endDate,
          limit: req.body.page_size, offset: (req.body.page_num -1)*req.body.page_size
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
  }
};

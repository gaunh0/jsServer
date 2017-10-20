/**
 * Created by ADMIN on 9/12/2017.
 */

const ErrorLog = require('../../../repository/mysql/ErrorLog');
const response = require('../../../libs/response');
const resCode = require('../../../utilities/response/code');
const resMessage = require('../../../utilities/response/message');

module.exports = {
  getAll: function (req, res, next) {
    ErrorLog.findJoin({imei: req.body.imei},
      {limit: req.body.page_size, offset: ((req.body.page_num-1)*req.body.page_size)}, (err, errorLog_f, total) => {
      if (err) {
        return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
      }
      else {
        return response.OK_PAGI(res, resCode.SUCCESS, resMessage.SUCCESS, errorLog_f, total)
      }
    })
  }
};

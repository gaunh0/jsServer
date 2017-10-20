/**
 * Created by Thien on 14/06/2017.
 */
const responseStatus = require('../utilities/response/status');

exports.OK = function (res, code, message, data) {
  return res.json({
    code: code,
    message: message,
    status: responseStatus.SUCCESS,
    data: data
  });
};

exports.OK_PAGI = function (res, code, message, data, total) {
  return res.json({
    code: code,
    message: message,
    status: responseStatus.SUCCESS,
    total: total,
    data: data
  });
};

exports.FAIL = function (res, code, message, data) {
  return res.json({
    code: code,
    message: message,
    status: responseStatus.FAIL,
    data: data
  });
};

exports.create = function (res, code, message, status, data) {
  return res.json({
    code: code,
    message: message,
    status: status,
    data: data
  });
};

exports.packageFAIL = function (code, message, data) {
  return {
    code: code,
    message: message,
    status: responseStatus.FAIL,
    data: data
  };
};

exports.packageOK = function (code, message, data) {
  return {
    code: code,
    message: message,
    status: responseStatus.SUCCESS,
    data: data
  };
};

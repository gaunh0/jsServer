/**
 * Created by ADMIN on 9/8/2017.
 */

const UserGroup = require('../../../repository/mysql/UserGroup');
const jwt = require('../../../libs/jwt');
const response = require('../../../libs/response');
const resCode = require('../../../utilities/response/code');
const resMessage = require('../../../utilities/response/message');

module.exports = {
  getAll: function (req, res, next) {
    jwt.checkToken(req.get('Authorization'), result => {
      if (result.status) {
        UserGroup.find({}, (err, userGroup_f) => {
          if (err) {
            return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
          }
          else {
            return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, userGroup_f)
          }
        })
      }
      else {
        res.json(result)
      }
    })
  }
};

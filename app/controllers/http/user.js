
const md5 = require('md5');
const config = require('../../../config/config');
const define = require('../../../global/define');
const randomstring = require('randomstring');
const mailer = require('../../../libs/mailer');
const user = require('../../../repository/mysql/User');
const userGroupUserMap = require('../../../repository/mysql/UserGroupUserMap');
const jwt = require('../../../libs/jwt');
const response = require('../../../libs/response');
const resCode = require('../../../utilities/response/code');
const resMessage = require('../../../utilities/response/message');

module.exports = {
  get: function(req, res, next) {
    if (req.query.account === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          let account = null;
          if (req.query.account === 'me') {
            account = result.data.account
          }
          else {
            account = req.query.account
          }
          user.find({account: account}, (err, user_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (user_f.length > 0) {
                userGroupUserMap.findJoin(['userGroup'], {userId: user_f[0].user_id, 'userGroup_user_map.status': define.ACTIVE},
                  {}, false, (err, userGroupUserMap_f) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    let data = {};
                    data.user = user_f[0];
                    data.userGroup = userGroupUserMap_f;
                    return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, data)
                  }
                })
              }
              else {
                return response.FAIL(res, resCode.USER_NOT_FOUND, resMessage.USER_NOT_FOUND, null)
              }
            }
          })
        }
        else {
          res.json(result)
        }
      })
    }
  },
  getPagi: function(req, res, next) {
    if (req.query.page === undefined || req.query.size === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          let offset = (parseInt(req.query.page) - 1)*parseInt(req.query.size);
          user.findPagi({}, {limit: parseInt(req.query.size), offset: offset},
            (err, user_f, total) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, user_f)
            }
          })
        }
        else {
          res.json(result)
        }
      })
    }
  },
  register: function (req, res, next) {
    if (req.body.account === undefined || req.body.password === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      user.find({account: req.body.account}, (err, user_f) => {
        if (err) {
          return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
        }
        else {
          if (user_f.length < 1) {
            let password = md5(req.body.password + config.md5Pass);
            let verifyKey = randomstring.generate({
              length: define.verify_key_length,
              charset: 'alphanumeric'
            });

            user.create({
              account: req.body.account, password: password,
              name: req.body.name, phone: req.body.phone,
              status: define.INACTIVE, verifyKey: verifyKey
            }, (err, user_c) => {
              if (err) {
                return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
              }
              else {
                /*let mailOptions = {
                  from: config.email.from,
                  to: req.body.account,
                  subject: config.email.subject,
                  text: 'Verify your account, please click link below:\n'
                  + config.urlVerify + '/' + req.body.account + '/' + verifyKey
                };

                mailer.sendMail(mailOptions, function (error, info) {

                });*/
                userGroupUserMap.create({
                  userId: user_c.insertId,
                  userGroupId: define.CUSTOMER_TYPE, status: define.ACTIVE
                }, (err) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                  }
                })
              }
            });
          }
          else {
            return response.FAIL(res, resCode.USER_EXISTS, resMessage.USER_EXISTS, null)
          }
        }
      })
    }
  },
  verify: function (req, res, next) {
    if (req.body.account === undefined || req.body.verifyKey === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      user.find({account: req.body.account}, (err, user_f) => {
        if (err) {
          return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
        }
        else {
          if (user_f.length > 0) {
            if (user_f[0].user_status === define.ACTIVE) {
              return response.FAIL(res, resCode.ALREADY_VERIFY, resMessage.ALREADY_VERIFY, null)
            }
            else {
              if (user_f[0].user_verifyKey === req.body.verifyKey) {
                user.update({account: req.body.account}, {status: define.ACTIVE}, (err, user_u) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    userGroupUserMap.find({userId: user_f[0].user_id, userGroupId: define.CUSTOMER_TYPE},
                      (err, userGroupUserMap_f) => {
                        if (err) {
                          return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                        }
                        else {
                          if (userGroupUserMap_f.length > 0) {
                            if (userGroupUserMap_f[0].userGroup_user_map_status === define.ACTIVE) {
                              return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                            }
                            else {
                              userGroupUserMap.update({
                                userId: user_f[0].user_id,
                                userGroupId: define.CUSTOMER_TYPE
                              }, (err) => {
                                if (err) {
                                  return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                }
                                else {
                                  return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                                }
                              })
                            }
                          }
                          else {
                            userGroupUserMap.create({
                              userId: user_f[0].user_id,
                              userGroupId: define.CUSTOMER_TYPE, status: define.ACTIVE
                            }, (err) => {
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
                  }
                })
              }
              else {
                return response.FAIL(res, resCode.INVALID_VERIFY_KEY, resMessage.INVALID_VERIFY_KEY, null)
              }
            }
          }
          else {
            return response.FAIL(res, resCode.USER_NOT_FOUND, resMessage.USER_NOT_FOUND, null)
          }
        }
      })
    }
  },
  auth: function (req, res, next) {
    if (req.body.account === undefined || req.body.password === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      user.find({account: req.body.account/*, status: define.ACTIVE*/}, (err, user_f) => {
        if (err) {
          return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
        }
        else {
          if (user_f.length > 0) {
            if (user_f[0].user_password === md5(req.body.password + config.md5Pass)) {
              return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, jwt.sign({account: req.body.account}))
            }
            else {
              return response.FAIL(res, resCode.LOGIN_FAIL, resMessage.LOGIN_FAIL, null)
            }
          }
          else {
            return response.FAIL(res, resCode.USER_NOT_FOUND, resMessage.USER_NOT_FOUND, null)
          }
        }
      })
    }
  },
  create: function(req, res, next) {
    if (req.body.account === undefined || req.body.password === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          user.find({account: req.body.account}, (err, user_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (user_f.length > 0) {
                return response.FAIL(res, resCode.USER_EXISTS, resMessage.USER_EXISTS, null)
              }
              else {
                let password = md5(req.body.password + config.md5Pass);
                user.create({
                  account: req.body.account, password: password,
                  name: req.body.name, phone: req.body.phone, status: define.ACTIVE
                }, (err) => {
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
        }
        else {
          res.json(result)
        }
      })
    }
  },
  update: function (req, res, next) {
    if (req.body.user_account === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          user.find({account: req.body.user_account}, (err, user_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (user_f.length > 0) {
                user.update({account: req.body.user_account}, {
                  name: req.body.user_name, phone: req.body.user_phone, sex: req.body.user_sex,
                  address: req.body.user_address, birthday: req.body.user_birthday
                }, (err) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                  }
                })
              }
              else {
                return response.FAIL(res, resCode.USER_NOT_FOUND, resMessage.USER_NOT_FOUND, null)
              }
            }
          })
        }
        else {
          res.json(result)
        }
      })
    }
  },
  delete: function (req, res, next) {
    if (req.body.length <= 0) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          let affectedRows = 0;
          for (let key in req.body) {
            user.delete({account: req.body[key].account}, (err, user_d) => {
              if (err) {
                return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
              }
              else {
                if (parseInt(key) === (req.body.length - 1)) {
                  return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, affectedRows + user_d.affectedRows)
                }
                else {
                  affectedRows += user_d.affectedRows
                }
              }
            })
          }
        }
        else {
          res.json(result)
        }
      })
    }
  },
  searchMultiple: function (req, res, next) {
    jwt.checkToken(req.get('Authorization'), result => {
      if (result.status) {
        let userGroupId = req.body.userGroupId;
        if (userGroupId == 0) {
          userGroupId = undefined
        }
        user.searchMultiple({name: req.body.name, phone: req.body.phone,
          account: req.body.account, userGroupId: userGroupId, limit: req.body.page_size,
          offset: (req.body.page_num - 1)*req.body.page_size}, (err, user_f, total) => {
          if (err) {
            return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
          }
          else {
            return response.OK_PAGI(res, resCode.SUCCESS, resMessage.SUCCESS, user_f, total)
          }
        })
      }
      else {
        res.json(result)
      }
    })
  }
};

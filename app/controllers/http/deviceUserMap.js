
const define = require('../../../global/define');
const jwt = require('../../../libs/jwt');
const user = require('../../../repository/mysql/User');
const device = require('../../../repository/mysql/Device');
const deviceUserMap = require('../../../repository/mysql/DeviceUserMap');
const response = require('../../../libs/response');
const resCode = require('../../../utilities/response/code');
const resMessage = require('../../../utilities/response/message');

module.exports = {
  add: function (req, res, next) {
    if (req.body.account === undefined || req.body.imei === undefined || req.body.addAccount === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          user.find({account: req.body.account/*, status: define.ACTIVE*/}, (err, user_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (user_f.length > 0) {
                device.find({imei: req.body.imei, status: define.ACTIVE}, (err, device_f) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    if (device_f.length > 0) {
                      deviceUserMap.find({userId: user_f[0].user_id, deviceId: device_f[0].device_id,
                      status: define.ACTIVE, owner: define.OWNER}, (err, deviceUserMap_f) => {
                        if (err) {
                          return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                        }
                        else {
                          if (deviceUserMap_f.length > 0) {
                            user.find({account: req.body.addAccount, status: define.ACTIVE}, (err, user_f1) => {
                              if (err) {
                                return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                              }
                              else {
                                if (user_f1.length > 0) {
                                  deviceUserMap.find({userId: user_f1[0].user_id, deviceId: device_f[0].device_id,
                                    status: define.ACTIVE, owner: define.COMANAGE
                                  }, (err, deviceUserMap_f1) => {
                                    if (err) {
                                      return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                    }
                                    else {
                                      if (deviceUserMap_f1.length > 0) {
                                        return response.FAIL(res, resCode.ASSIGNED, resMessage.ASSIGNED, err)
                                      }
                                      else {
                                        deviceUserMap.create({
                                          userId: user_f1[0].user_id, deviceId: device_f[0].device_id,
                                          status: define.ACTIVE, owner: define.COMANAGE
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
                                  return response.FAIL(res, resCode.USER_NOT_FOUND, resMessage.USER_NOT_FOUND, null)
                                }
                              }
                            })
                          }
                          else {
                            return response.FAIL(res, resCode.NOT_OWNER, resMessage.NOT_OWNER, null)
                          }
                        }
                      })
                    }
                    else {
                      res.json(device_f)
                    }
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
  remove: function (req, res, next) {
    if (req.body.account === undefined || req.body.imei === undefined || req.body.removeAccount === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          user.find({account: req.body.account/*, status: define.ACTIVE*/}, (err, user_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (user_f.length > 0) {
                device.find({imei: req.body.imei, status: define.ACTIVE}, (err, device_f) => {
                  if (device_f.length > 0) {
                    deviceUserMap.find({userId: user_f[0].user_id, deviceId: device_f[0].device_id,
                    status: define.ACTIVE, owner: define.OWNER}, (err, deviceUserMap_f) => {
                      if (err) {
                        return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                      }
                      else {
                        if (deviceUserMap_f.length > 0) {
                          user.find({account: req.body.removeAccount/*, status: define.ACTIVE*/},
                            (err, user_f1) => {
                            if (err) {
                              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                            }
                            else {
                              if (user_f1.length > 0) {
                                deviceUserMap.find({userId: user_f1[0].user_id,
                                  deviceId: device_f[0].device_id, status: define.ACTIVE,
                                  owner: define.COMANAGE
                                }, (err, deviceUserMap_f1) => {
                                  if (err) {
                                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                  }
                                  else {
                                    if (deviceUserMap_f1.length > 0) {
                                      deviceUserMap.update({userId: user_f1[0].user_id,
                                          deviceId: device_f[0].device_id},
                                        {status: define.INACTIVE}, (err) => {
                                          if (err) {
                                            return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                          }
                                          else {
                                            return response.FAIL(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                                          }
                                        })
                                    }
                                    else {
                                      return response.FAIL(res, resCode.NOT_ASSIGNED, resMessage.NOT_ASSIGNED, null)
                                    }
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
                          return response.FAIL(res, resCode.NOT_OWNER, resMessage.NOT_OWNER, null)
                        }
                      }
                    })
                  }
                  else {
                    return response.FAIL(res, resCode.DEVICE_NOT_FOUND, resMessage.DEVICE_NOT_FOUND, null)
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
  register: function (req, res, next) {
    if (req.body.account === undefined || req.body.imei === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          user.find({account: req.body.account/*, status: define.ACTIVE*/}, (err, user_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (user_f.length > 0) {
                device.find({imei: req.body.imei}, (err, device_f) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    if (device_f.length > 0) {
                      deviceUserMap.find({deviceId: device_f[0].device_id,
                        status: define.ACTIVE}, (err, deviceUserMap_f) => {
                        if (err) {
                          return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                        }
                        else {
                          if (deviceUserMap_f.length > 0) {
                            return response.FAIL(res, resCode.DEVICE_ASSIGNED, resMessage.DEVICE_ASSIGNED, err)
                          }
                          else {
                            deviceUserMap.create({
                              userId: user_f[0].user_id, deviceId: device_f[0].device_id,
                              status: define.ACTIVE, owner: define.OWNER
                            }, (err) => {
                              if (err) {
                                return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                              }
                              else {
                                device.update({imei: req.body.imei}, {status: define.ACTIVE}, err => {
                                  if (err) {
                                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                  }
                                  else {
                                    return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, err)
                                  }
                                })
                              }
                            })
                          }
                        }
                      })
                    }
                    else {
                      return response.FAIL(res, resCode.DEVICE_NOT_FOUND, resMessage.DEVICE_NOT_FOUND, err)
                    }
                  }
                })
              }
              else {
                return response.FAIL(res, resCode.USER_NOT_FOUND, resMessage.USER_NOT_FOUND, err)
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
  move: function (req, res, next) {
    if (req.body.fromAccount === undefined || req.body.imei === undefined || req.body.toAccount === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          user.find({account: req.body.fromAccount/*, status: define.ACTIVE*/}, (err, user_f) => {
            if (err) {
              return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
            }
            else {
              if (user_f.length > 0) {
                device.find({imei: req.body.imei, status: define.ACTIVE}, (err, device_f) => {
                  if (err) {
                    return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                  }
                  else {
                    if (device_f.length > 0) {
                      deviceUserMap.find({userId: user_f[0].user_id,
                        deviceId: device_f[0].device_id, status: define.ACTIVE,
                        owner: define.OWNER}, (err, deviceUserMap_f) => {
                        if (err) {
                          return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                        }
                        else {
                          if (deviceUserMap_f.length > 0) {
                            user.find({account: req.body.toAccount/*, status: define.ACTIVE*/},
                              (err, user_f1) => {
                              if (err) {
                                return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                              }
                              else {
                                if (user_f1.length > 0) {
                                  deviceUserMap.find({userId: user_f1[0].user_id,
                                    deviceId: device_f[0].device_id, status: define.ACTIVE
                                  }, (err, deviceUserMap_f1) => {
                                    if (err) {
                                      return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                    }
                                    else {
                                      if (deviceUserMap_f1.length > 0) {
                                        deviceUserMap.update({userId: user_f[0].user_id,
                                            deviceId: device_f[0].device_id},
                                          {status: define.INACTIVE}, (err) => {
                                          if (err) {
                                            return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                          }
                                          else {
                                            deviceUserMap.update({userId: user_f1[0].user_id,
                                                deviceId: device_f[0].device_id},
                                              {owner: define.OWNER}, (err) => {
                                                if (err) {
                                                  return response.FAIL(res, resCode.EXCEPTION, resMessage.EXCEPTION, err)
                                                }
                                                else {
                                                  return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                                                }
                                              })
                                          }
                                        })
                                      }
                                      else {
                                        deviceUserMap.update({userId: user_f[0].user_id,
                                            deviceId: device_f[0].device_id},
                                          {status: define.INACTIVE}, err => {
                                            if (err) {
                                              return response.FAIL(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                                            }
                                            else {
                                              deviceUserMap.create({
                                                userId: user_f1[0].user_id, deviceId: device_f[0].device_id,
                                                status: define.ACTIVE, owner: define.OWNER
                                              }, err => {
                                                if (err) {
                                                  return response.FAIL(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                                                }
                                                else {
                                                  return response.OK(res, resCode.SUCCESS, resMessage.SUCCESS, null)
                                                }
                                              })
                                            }
                                          })
                                      }
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
                            return response.FAIL(res, resCode.NOT_OWNER, resMessage.NOT_OWNER, null)
                          }
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
  }
  /*move: function (req, res, next) {
    if (req.body.fromAccount === undefined || req.body.imei === undefined || req.body.toAccount === undefined) {
      return response.FAIL(res, resCode.MISS_PARAM, resMessage.MISS_PARAM, null)
    }
    else {
      jwt.checkToken(req.get('Authorization'), result => {
        if (result.status) {
          user.find({account: req.body.fromAccount}, user_f => {
            if (user_f.status) {
              device.find({imei: req.body.imei}, device_f => {
                if (device_f.status) {
                  deviceUserMap.find({userId: user_f.data[0].id, deviceId: device_f.data[0].id}, deviceUserMap_f => {
                    if (deviceUserMap_f.status && deviceUserMap_f.data[0].owner === define.device_owner &&
                      deviceUserMap_f.data[0].status === define.active) {
                      user.find({account: req.body.toUsername}, user_f1 => {
                        if (user_f1.status) {
                          deviceUserMap.find({
                            userId: user_f1.data[0].id,
                            deviceId: device_f.data[0].id
                          }, deviceUserMap_f1 => {
                            if (deviceUserMap_f1.status) {
                              deviceUserMap.update({userId: user_f.data[0].id, deviceId: device_f.data[0].id},
                                {status: define.inactive}, deviceUserMap_u => {
                                  if (deviceUserMap_u.status) {
                                    deviceUserMap.update({userId: user_f1.data[0].id, deviceId: device_f.data[0].id},
                                      {owner: define.device_owner, status: define.active}, deviceUserMap_c => {
                                        res.json(deviceUserMap_c)
                                      })
                                  }
                                  else {
                                    res.json(deviceUserMap_u)
                                  }
                                })
                            }
                            else {
                              deviceUserMap.update({userId: user_f.data[0].id, deviceId: device_f.data[0].id},
                                {status: define.inactive}, deviceUserMap_u1 => {
                                  if (deviceUserMap_u1.status) {
                                    deviceUserMap.create({
                                      userId: user_f1.data[0].id, deviceId: device_f.data[0].id,
                                      status: define.active, owner: define.device_owner
                                    }, deviceUserMap_c1 => {
                                      res.json(deviceUserMap_c1)
                                    })
                                  }
                                  else {
                                    res.json(deviceUserMap_u1)
                                  }
                                })
                            }
                          })
                        }
                        else {
                          deviceUserMap.update({userId: user_f.data[0].id, deviceId: device_f.data[0].id},
                            {status: define.inactive}, deviceUserMap_u2 => {
                              if (deviceUserMap_u2.status) {
                                let password = randomstring.generate({
                                  length: 8,
                                  charset: 'alphanumeric'
                                });
                                user.create({
                                  username: req.body.toUsername,
                                  password: password,
                                  type: define.user_type,
                                  status: define.active
                                }, user_c => {
                                  if (user_c.status) {
                                    deviceUserMap.create({
                                      userId: user_c.data.insertId, deviceId: device_f.data[0].id,
                                      status: define.active, owner: define.device_owner
                                    }, deviceUserMap_c2 => {
                                      res.json(deviceUserMap_c2)
                                    });
                                    let mailOptions = {
                                      from: config.email.from,
                                      to: req.body.toUsername,
                                      subject: config.email.subject,
                                      text: 'Your password is ' + password
                                    };

                                    mailer.sendMail(mailOptions, function (error, info) {

                                    });
                                  }
                                  else {
                                    res.json(user_c)
                                  }
                                })
                              }
                              else {
                                res.json(deviceUserMap_u2)
                              }
                            })
                        }
                      })
                    }
                    else {
                      res.json({
                        code: response.NOT_OWNER_CODE,
                        message: response.NOT_OWNER_MSG,
                        status: response.FAIL_STATUS,
                        data: null
                      })
                    }
                  })
                }
                else {
                  res.json(device_f)
                }
              })
            }
            else {
              res.json(user_f)
            }
          })
        }
        else {
          res.json(result)
        }
      })
    }
  }*/
};

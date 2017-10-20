/**
 * Created by nttuan on 16/05/2017.
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const time = require('./time');
const response = require('../libs/response');
const resCode = require('../utilities/response/code');
const resMessage = require('../utilities/response/message');

module.exports = {
  sign: function (data) {
    return jwt.sign({account: data.account}, 'secret', { expiresIn: 60 * 60 * 60 * 60})
  },
  verify: function (token, callback) {
    jwt.verify(token, 'secret', function (err, data) {
      callback(err, data)
    })
  },
  checkToken: function (token, callback) {
    if (token) {
      this.verify(token, function (err, data) {
        if (err) {
          callback(response.packageFAIL(resCode.INVALID_TOKEN, resMessage.INVALID_TOKEN, null))
        }
        else {
          callback(response.packageOK(resCode.SUCCESS, resMessage.SUCCESS, data))
        }
      })
    }
    else {
      callback(response.packageFAIL(resCode.NOT_FOUND_TOKEN, resMessage.NOT_FOUND_TOKEN, null))
    }
  },
  getGGToken: function (urlFile, callback) {
    fs.readFile(urlFile, function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Gmail API.
      let data = JSON.parse(content);
      jwt.sign({
        'iss': data.client_email,
        'sub': data.client_email,
        'scope': 'https://mail.google.com/',
        'aud': 'https://www.googleapis.com/oauth2/v4/token',
        'exp': Math.round((time.getTimestamp() + 60*60*1000)/1000),
        'iat': Math.round(time.getTimestamp()/1000)
      }, data.private_key, {algorithm: 'RS256'}, function (err, token) {
        callback(err, token)
      })
    })
  }
};

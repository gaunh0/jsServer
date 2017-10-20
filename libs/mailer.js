/**
 * Created by Thien on 02/06/2017.
 */
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'martingk111@gmail.com',
    pass: '04111994'
  }
});

module.exports = transporter;
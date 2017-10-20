
const mysql = require('../../libs/mysql');

const UserSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  account: String,
  password: String,
  name: String,
  phone: String,
  status: Number,
  verifyKey: String,
  sex: Number,
  birthday: Date,
  address: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('user', UserSchema);

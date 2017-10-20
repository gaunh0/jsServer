const mysql = require('../../libs/mysql');

const HomeSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  hid: String,
  homeName: String,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('home', HomeSchema);

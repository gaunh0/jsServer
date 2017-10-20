
const mysql = require('../../libs/mysql');

const UserGroupSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  uid : String,
  did : String
};

mysql.model('user_group', UserGroupSchema);
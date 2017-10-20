
const mysql = require('../../libs/mysql');

const UserGroupUserMapSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  userId: {
    type: Number,
    foreignKey: 'user'
  },
  userGroupId: {
    type: Number,
    foreignKey: 'userGroup'
  },
  status: Number,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('userGroup_user_map', UserGroupUserMapSchema);

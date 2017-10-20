const mysql = require('../../libs/mysql');

const RoomSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  rid: String,
  roomName: String,
  hid : Number,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('room', RoomSchema);

/**
 * Created by nttuan on 19/05/2017.
 */

const device = require('../../../repository/mysql/Device');
const deviceLog = require('../../../repository/mysql/DeviceLog');
const response = require('../../../global/response');
const time = require('../../../libs/time');
const define = require('../../../global/define');
const resCode = require('../../../utilities/response/code');

module.exports = {
  ping: function () {
    console.log('Ping command');
    return JSON.stringify({cmd: 'RPING', rcode: 200});
  },
  register: function(data){
    console.log(data);
    device.find({did: data.uid}, (eer, device_f) => {
      console.log(data.uid);
      if(err){
        return JSON.stringify({cmd: 'RREGISTER', msg: err, rcode: 300})
      }
      else {
        if(device_f.length > 0) {
          return JSON.stringify({cmd: 'RREGISTER', rcode: 150})
        }
        else{
          device.create({did:data.did},(err,device_c)=>{
            if(eer){
              return JSON.stringify({cmd: 'RREGISTER', msg: err, rcode: 302})
            }
            else {
              if(device_c){
                return JSON.stringify({cmd: 'RREGISTER', rcode: 200})
              }
              else{
                return JSON.stringify({cmd: 'RREGISTER', rcode: 144})
              }
            }
          })
        }
      }
    })
  },

  rerror: function(){
    console.log('Command err');
    return JSON.stringify({cmd:'ERROR', rcode:100});
  }
};

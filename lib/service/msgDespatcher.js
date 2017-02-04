/**
 * Created by dilip on 8/1/17.
 */


var eyeService = require('../config/service').eye;
var msgService = require('../config/service').message;


function getMessageData() {
    msgService.emit('getMessages', {payload: {type: 'MSG'}}, {
        type: 'rpc', callback: function (err, res) {
            if (err) {
                // _RES_MSG = {};
            }
            else
                _RES_MSG = res;
        }
    });
}
//Initial Call
//getMessageData();
//Bind th Eye Channel Binder foe EYE
//eyeService.on('triggerUpdateMsg', function (req, channel, cb) {
//
//    getMessageData();
//    cb(null, true);
//});
//

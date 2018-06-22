// PARCELKEY SCRIPT

// NETWORK SETTINGS
// Home
var url = 'http://192.168.0.150:3000'

process.setMaxListeners(0);

// IMPORTS
const ParcelKeyOS = require('./modules/parcelKeyOS');
const io = require('socket.io-client');
const socket = io(url);

// INIT
const OS = new ParcelKeyOS();

// BOOT ParcelKeyOS
OS.boot();

// SOCKET SERVER
socket.emit('testchannel', 'Hello from ParcelKey');

socket.on('testchannel', function(msg){
    console.log('testchannel: ' + msg);
});

socket.on('toParcelKey', function(msg){
    // console.log('toParcelKey: ' + msg);
    OS.e.emit('notification', msg);
    if(msg == 'Kontaktanfrage!'){
        setTimeout(()=>{
            socket.emit('toAPI', 'Angenommen!');
        }, 9000)
    }
});

setInterval(()=>{
    // console.log(OS.CONTROLLER.MODEL.DISTANCE);
    let data = {
        distance: OS.CONTROLLER.MODEL.DISTANCE,
        time: OS.CONTROLLER.VIEW.time
    }
    data = JSON.stringify(data);
    socket.emit('toAPI', data);
}, 2000)
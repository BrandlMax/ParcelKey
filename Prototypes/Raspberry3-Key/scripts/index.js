// PARCELKEY SCRIPT

// NETWORK SETTINGS
// Home
var url = '192.168.0.27'
// Uni
// var url = '192.168.0.80'

process.setMaxListeners(0);

// IMPORTS
const io = require('socket.io-client');
const ParcelKeyOS = require('./modules/parcelKeyOS');

// INIT
const OS = new ParcelKeyOS();

// SOCKET SERVER
const socket = io('http://'+ url +':3000');
console.log('Server Running');

// BOOT ParcelKeyOS
OS.boot();

// SOCKETS
socket.emit('testchannel', 'Hello from RaspberryPi 3');

socket.on('testchannel', function(msg){
    console.log('testchannel: ' + msg);
});

socket.on('toParcelKey', function(msg){
    console.log('toParcelKey: ' + msg);
    OS.e.emit('notification', msg);
});



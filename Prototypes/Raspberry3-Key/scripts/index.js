// PARCELKEY
const io = require('socket.io-client');

// Home
var url = '192.168.0.80'

// Uni
// var url = '192.168.0.80'

const socket = io('http://192.168.0.80:3000');

socket.emit('testchannel', 'Hello from RaspberryPi 3');

socket.on('testchannel', function(msg){
    console.log('testchannel: ' + msg);
});

socket.on('toParcelKey', function(msg){
    console.log('toParcelKey: ' + msg);
});

console.log('Running');
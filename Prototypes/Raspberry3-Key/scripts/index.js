// PARCELKEY SCRIPT

// NETWORK SETTINGS
// Home
var url = 'ws://192.168.0.150:3001'

process.setMaxListeners(0);

// IMPORTS
let wSocket = require('./modules/wsocket')
const WebSocket = require('ws');
const ParcelKeyOS = require('./modules/parcelKeyOS');

// INIT
const OS = new ParcelKeyOS();

// BOOT ParcelKeyOS
OS.boot();

// SOCKET SERVER
const ws = new WebSocket(url);
let socket;

ws.on('open', function open() {

    socket = new wSocket(ws);
    console.log('connected');

    socket.on('testchannel', function(msg){
        console.log('testchannel: ' + msg);
    });
    
    socket.on('toParcelKey', function(msg){
        console.log('toParcelKey: ' + msg);
        OS.e.emit('notification', msg);
    });
    
    socket.emit('testchannel', 'Hello from RaspberryPi 3');
    
});

ws.on('close', function close() {
    console.log('disconnected');
});




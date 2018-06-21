// SETTINGS //////////////////  

// Home
// let url = '192.168.0.80'

// iMac
// let url = '192.168.0.150'

// Uni
let url = '192.168.12.107'

// SERVER //////////////////  

// HTTPS for Web Bluetooth API
let path = require('path')
let fs = require('fs')
// let certOptions = {
//     key: fs.readFileSync(path.resolve('SSL/server.key')),
//     cert: fs.readFileSync(path.resolve('SSL/server.crt'))
// }

// SERVER
let express = require('express');
let app = require('express')();
let http = require('http').Server(app);

let wSocket = require('./modules/wsocket')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

app.use(express.static(__dirname + '/www' ));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/api/');
});

app.get('/shop', function(req, res){
    res.sendFile(__dirname + '/www/shop/');
});

// SOCKET
wss.on('connection', function connection(ws) {
    socket = new wSocket(ws);

    ws.on('open', function open() {
        console.log('connected');
    });

    socket.on('testchannel', function(msg){
        console.log('testchannel: ' + msg);
    });
    
    socket.emit('testchannel','Hello from Server');
    socket.emit('toParcelKey','Hello ParcelKey from Server!');
    socket.emit('toParcelKeyTracker','Hello ParcelKeyTracker from Server!');
      
    ws.on('close', function close() {
          console.log('disconnected');
    });
    
});

// io.on('connection', function(socket){
//   console.log('a user connected');

//   socket.on('testchannel', function(msg){
//     console.log('testchannel: ' + msg);
//   });

//   socket.emit('testchannel','Hello from Server');
//   socket.emit('toParcelKey','Hello ParcelKey from Server!');
//   socket.emit('toParcelKeyTracker','Hello ParcelKeyTracker from Server!');

//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });


// START SERVER
http.listen(3000 ,url, function(){
  console.log('listening on' + url + ':3000');
  console.log('ws listening on ' + url + ':3001');
});
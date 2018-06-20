// SETTINGS //////////////////  

// Home
// var url = '192.168.0.80'

// iMac
// var url = '192.168.0.150'

// Uni
var url = '172.20.10.3'

// SERVER //////////////////  

// HTTPS for Web Bluetooth API
var path = require('path')
var fs = require('fs')
// var certOptions = {
//     key: fs.readFileSync(path.resolve('SSL/server.key')),
//     cert: fs.readFileSync(path.resolve('SSL/server.crt'))
// }

// SERVER
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/www' ));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/api/');
});

app.get('/shop', function(req, res){
    res.sendFile(__dirname + '/www/shop/');
});

io.use(function(socket, next){
    console.log('query:', socket.handshake.query);
})

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('testchannel', function(msg){
    console.log('testchannel: ' + msg);
  });

  socket.emit('testchannel','Hello from Server');
  socket.emit('toParcelKey','Hello ParcelKey from Server!');
  socket.emit('toParcelKeyTracker','Hello ParcelKeyTracker from Server!');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000 ,url, function(){
  console.log('listening on *:3000');
});
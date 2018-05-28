// Home
var url = '192.168.0.80'

// Uni
// var url = '192.168.0.80'

// HTTPS for Web Bluetooth API
var path = require('path')
var fs = require('fs')
var certOptions = {
    key: fs.readFileSync(path.resolve('SSL/server.key')),
    cert: fs.readFileSync(path.resolve('SSL/server.crt'))
}

// SERVER
var express = require('express');
var app = require('express')();
var https = require('https').Server(certOptions,app);
var io = require('socket.io')(https);

app.use(express.static(__dirname + '/www' ));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/api/');
});

app.get('/shop', function(req, res){
    res.sendFile(__dirname + '/www/shop/');
});

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

https.listen(3000,url, function(){
  console.log('listening on *:3000');
});
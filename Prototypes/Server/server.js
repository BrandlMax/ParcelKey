var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Home
var url = '192.168.0.80'

// Uni
// var url = '192.168.0.80'

app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/api/index.html');
});

app.get('/shop', function(req, res){
    res.sendFile(__dirname + '/www/shop/index.html');
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

http.listen(3000,url, function(){
  console.log('listening on *:3000');
});
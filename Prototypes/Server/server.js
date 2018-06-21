// PARCELKEY SERVER
// SETTINGS //////////////////  

let os = require('os');
let ifaces = os.networkInterfaces();
let url; 

// Get Current Local IP Adress for Server
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      url = iface.address.toString()
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});


// SERVER //////////////////  
// HTTPS for Web Bluetooth API
let path = require('path')
let fs = require('fs')
// let certOptions = {
//     key: fs.readFileSync(path.resolve('SSL/server.key')),
//     cert: fs.readFileSync(path.resolve('SSL/server.crt'))
// }

// WEB SERVER
let express = require('express');
let app = require('express')();
let http = require('http').Server(app);

app.use(express.static(__dirname + '/www' ));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/www/shop/');
});

app.get('/api', function(req, res){
    res.sendFile(__dirname + '/www/api/');
});


// SOCKET SERVER
let wSocket = require('./modules/wsocket')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
    socket = new wSocket(ws);

    ws.on('open', function open() {
        console.log('a user connected');
    });

    socket.on('testchannel', function(msg){
        console.log('testchannel: ' + msg);
    });
    
    socket.emit('testchannel','Hello from Server');
    socket.emit('toParcelKey','Hello ParcelKey from Server!');
    socket.emit('toParcelKeyTracker','Hello ParcelKeyTracker from Server!');
      
    ws.on('close', function close() {
          console.log('a user disconnected');
    });
    
});

// START SERVER
http.listen(3000 ,url, function(){
  console.log('listening on http://' + url + ':3000/');
  console.log('ws listening on ws://' + url + ':3001/');
});
// PARCELKEY SERVER
// SETTINGS //////////////////  

let os = require('os');
let ifaces = os.networkInterfaces();
let url;

// Get Current Local IP Adress for Server
// https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js/3654601#3654601
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

// url="172.16.65.10";
// url="192.168.0.150";

// SERVER //////////////////  
let path = require('path')
let fs = require('fs')

// HTTPS for Web Bluetooth API
// let certOptions = {
//     key: fs.readFileSync(path.resolve('SSL/server.key')),
//     cert: fs.readFileSync(path.resolve('SSL/server.crt'))
// }

// WEB SERVER
let express = require('express');
let app = require('express')();
let http = require('http').Server(app);

app.use(express.static(__dirname + '/www'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/www/shop/');
});

app.get('/api', function (req, res) {
    res.sendFile(__dirname + '/www/api/');
});

// SOCKETio SERVER
var io = require('socket.io')(http);

io.on('connection', function (socket) {

    console.log('a user connected');

    socket.on('testchannel', function (msg) {
        console.log('testchannel: ' + msg);
    });

    socket.on('toParcelKey', function (msg) {
        console.log('toPK')
        socket.broadcast.emit('toParcelKey', msg);
    });

    socket.on('toParcelKeyTracker', function (msg) {
        socket.broadcast.emit('toParcelKeyTracker', msg);
        wsocket.emit('toParcelKeyTracker', msg)
    });

    socket.on('toShop', function (msg) {
        socket.broadcast.emit('toShop', msg);
    });

    socket.on('toAPI', function (msg) {
        socket.broadcast.emit('toAPI', msg);
    });

    socket.on('toServer', function (msg) {
        console.log('toServer', msg);
    });

    socket.emit('testchannel', 'Hello @ all from Server');
    socket.emit('toParcelKey', 'Hello ParcelKey from Server!');
    socket.emit('toParcelKeyTracker', 'Hello ParcelKeyTracker from Server!');
    socket.emit('toAPI', 'Hello API from Server!');
    socket.emit('toShop', 'Hello Shop from Server!');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});


// WebSocket Server
let wSocket = require('./modules/wsocket')
const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 3001
});
let wsocket = null;

wss.on('connection', function connection(ws) {
    wsocket = new wSocket(ws);

    ws.on('open', function open() {
        console.log('a user connected');
    });

    ws.on('message', function incoming(message) {
        message = JSON.parse(message);

        // Message from Tracker -> Redirection
        switch (message.channel) {
            case 'toParcelKey':
                io.sockets.emit('toParcelKey', message.data)
                break;

            default:
                console.log('wSocket: ', message)
                break;
        }
    });

    ws.on('close', function close() {
        console.log('a user disconnected');
    });

});


// START SERVER
http.listen(3000, url, function () {
    console.log('listening on http://' + url + ':3000/');
    console.log('ws listening on ws://' + url + ':3001/');
    // CONFIG LOGS
    let configString = {
        "serverIpAdress": url
    };
    console.log('//////// Config File: ////////');
    console.log(JSON.stringify(configString));
    console.log('//////////////////////////////');
});
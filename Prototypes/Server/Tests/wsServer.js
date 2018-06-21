const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 3001 });

function send(ws, channel, data) {
    ws.send(JSON.stringify({
        channel: channel,
        data: data,
    }));
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    send(ws, 'testchannel', 'something');
  });
 
  send(ws, 'test', 'something');
});

console.log('Started');
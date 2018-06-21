// WebSocket Helper
module.exports = class WSio{
    constructor(ws){
        this.ws = ws;
    }

    on(channel, callback){
        this.ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            message = JSON.parse(message);
            if(message.channel == channel){
                return callback(message.data)
            }
        });
    }

    emit(channel, data){
        this.ws.send(JSON.stringify({
            channel: channel,
            data: data,
        }))
    }

}
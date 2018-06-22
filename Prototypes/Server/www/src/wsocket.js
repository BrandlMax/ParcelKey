class wSocket{
    constructor(ws){
        this.ws = ws
    }

    on(channel, callback){
        connection.onmessage = function (msg) {
            let message = JSON.parse(msg.data);
            if(message.channel == channel){
                return callback(message.data)
            }
        };    
    }

    emit(channel, data){
        this.ws.send(JSON.stringify({
            channel: channel,
            data: data,
        }))
    }
}
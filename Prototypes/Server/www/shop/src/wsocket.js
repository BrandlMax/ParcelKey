class wSocket{
    constructor(ws){
        this.ws = ws
    }

    on(channel, callback){
        this.ws.onmessage = function (e) {
            let message = JSON.parse(e.data);
            if(message.channel == channel){
                return callback(message.data)
            }
        };
    }

    emit(channel, data){
        console.log(JSON.stringify({
            channel: channel,
            data: data,
        }))

        this.ws.send(JSON.stringify({
            channel: channel,
            data: data,
        }))
    }
}
// ParcelKey OS
var events = require('events');
const Controller = require('./controller');

module.exports = class pkOS{
    constructor(){
        this.CONTROLLER = new Controller();
        this.e = new events.EventEmitter();
    }
    
    boot(){
        this.CONTROLLER.boot();

        this.e.on('notification', (e)=>{
            console.log('notification', e);
        })
    }

}
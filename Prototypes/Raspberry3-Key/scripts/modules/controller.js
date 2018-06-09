// Controller: Triggers View / Events
const events = require('events');
const Model = require('./model');
const View = require('./view');

const checkGestures = require('./checkGestures');

module.exports = class Controller{
    constructor(){
        this.MODEL = new Model();
        this.VIEW = new View();
        this.GESTURES = new checkGestures();

        this.e = new events.EventEmitter();
    }
    
    boot(){
        // BOOT
        this.VIEW.boot();
        this.MODEL.boot();

        // DATA HANDLING
        this.MODEL.e.on('newGyroData', (e)=>{
            this.GESTURES.check(e);
            this.VIEW.gyroData = e;
        })

        this.MODEL.e.on('newDistanceData', (e)=>{
            // console.log('d:',e);
            this.VIEW.e.emit('newDistanceData', e);
        })

        // GESTURES HANDLING
        this.GESTURES.e.on('gestureDetected', (e)=>{
            this.VIEW.e.emit('newGesture', e);
        })
    }

}
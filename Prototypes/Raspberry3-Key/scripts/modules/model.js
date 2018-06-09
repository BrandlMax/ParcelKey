// Model: Gets the Data
const events = require('events');
const getGyroData = require('./getGyroData');
const getBeaconDistance = require('./getBeaconDistance');


module.exports = class Model{
    constructor(){
        this.OLD_DISTANCE;
        this.DISTANCE;

        this.OLD_GYRO = {accel: ''};
        this.GYRO = {accel: ''};

        this.e = new events.EventEmitter();
    }
    
    boot(){
        setInterval(()=>{
            this.DISTANCE = getBeaconDistance();
            this.GYRO = getGyroData();

            if(this.OLD_GYRO.accel != this.GYRO.accel){
                if(this.GYRO.init){
                    this.e.emit('newGyroData', this.GYRO);
                }
                this.OLD_GYRO = this.GYRO;
            }

            // console.log([this.OLD_DISTANCE, this.DISTANCE])
            if(this.OLD_DISTANCE != this.DISTANCE){
                this.e.emit('newDistanceData', this.DISTANCE);
                this.OLD_DISTANCE = this.DISTANCE;
            }
        },10);
    }

}
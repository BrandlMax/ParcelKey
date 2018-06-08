// ParcelKey OS

const getGyroData = require('./getGyroData');
const getBeaconDistance = require('./getBeaconDistance');

const UserInterface = require('./ui');
UI = new UserInterface();

const AmbientLight = require('./ambientLED');
LIGHT = new AmbientLight(27, 22, 17);

let distanceInterval;

// Already Triggered States
let lightProblemTriggered = false;
let lightOkTriggered = false;
let lightInitTriggered = true;
let lightStandbyTriggered = false;

module.exports = class pkOS{
    constructor(){
        this.OLDSTATE;
        this.STATE;
        this.DISTANCE;
        this.GYRO;

        this.zBefore = 'init';
        this.gYBefore = 'init';

        this.selectLeft = false;
        this.selectRight = false;
        this.accept = false;
        this.decline = false;
    }
    
    boot(){
        UI.init();
        this.setState('stateStartUp');

        // Run Loop
        setInterval(() => {
            // get GYRO Data
            let GyroData = getGyroData();
            if(GyroData.init){
                //console.log(GyroData);
                this.GYRO = GyroData;
            }
            
            // Checks
            this.checkState();
            this.checkInput();

        }, 300);

        // Beacon / Distance Scanning Loop
        setInterval(() => {
            let BeaconDistance = getBeaconDistance();
            this.DISTANCE = BeaconDistance;
        }, 300); 
    }

    // INPUT MANAGER

    checkInput(){

        if(this.GYRO.init){

            // SELECT RIGHT
            if(this.GYRO.accel.y > 0.50 && this.GYRO.accel.x < -0.35){
                this.selectRight = true;
            }else{
                this.selectRight = false;
            }

            // SELECT LEFT
            if(this.GYRO.accel.y > 0.50 && this.GYRO.accel.x > 0.35){
                this.selectLeft = true;
            }else{
                this.selectLeft = false;
            }

            // ACCEPT
            let zNow = this.GYRO.accel.z;

            if(this.zBefore != 'init'){

                let zdif = Math.abs(this.zBefore - zNow);
                // console.log('dif:', zdif);
                // console.log('gZ:',this.GYRO.gyro.z);

                if(zdif > 0.12){
                    this.accept = true;
                }else{
                    this.accept = false;
                }

                this.zBefore = zNow;
            }else{
                this.zBefore = zNow;
            }

            // DECLINE
            let gYNow = this.GYRO.gyro.y;

            if(this.gYBefore != 'init'){

                let gYdif = Math.abs(this.gYBefore - gYNow);
                // console.log('dif:', gYdif);
                // console.log('gZ:',this.GYRO.gyro.z);

                if(gYdif > 20.0){
                    this.decline = true;
                }else{
                    this.decline = false;
                }

                this.gYBefore = gYNow;
            }else{
                this.gYBefore = gYNow;
            }


        }

    }

    // STATE MANAGEMENT
    setState(newState){
        this.OLDSTATE = this.STATE;
        this.STATE = newState;
    }

    checkState(){
        switch (this.STATE) {
            case 'stateStartUp':
                this.stateStartUp();
                break;

            case 'stateDistanceMeters':
                this.stateDistanceMeters();
                break;

            case 'stateDistanceMinutes':
                this.stateDistanceMinutes();
                break;

            case 'stateGyroData':
                this.stateGyroData();
                break;

            case 'stateChangeTimeSlot':
                this.stateChangeTimeSlot();
                break;

            case 'stateChangeDay':
                this.stateChangeDay();
                break;

            case 'stateChangeTime':
                this.stateChangeTime();
                break;

            case 'stateBack':
                this.stateBack();
                break;
        
            default:
                this.stateError();
                break;
        }
    }

    // STATES
    stateStartUp(){
        // UI.standBy();
        this.setState('stateGyroData');
        LIGHT.init();
    }

    stateDistanceMeters(){

        UI.writeDistance(this.DISTANCE, 1);
        console.log(this.DISTANCE);

        if(!lightOkTriggered){
            LIGHT.ok();
            lightOkTriggered = true;
        }
        

        if(this.selectLeft){
            console.log('Left');
            console.log('________________');
            this.setState('stateGyroData');
        }
    }

    stateDistanceMinutes(){
        UI.writeText('10 Minuten');
    }

    stateGyroData(){
        // console.log(this.GYRO);
        UI.writeGYRO(this.GYRO);

        if(!lightInitTriggered){
            lightInitTriggered = true;
            LIGHT.init();
        }

        if(this.accept){
            console.log('Accept');
            console.log('________________');
        }

        if(this.decline){
            console.log('Decline');
            console.log('________________');
        }

        if(this.selectRight){
            console.log('Right');
            console.log('________________');
            this.setState('stateDistanceMeters');
        }

        if(this.selectLeft){
            console.log('Left');
            console.log('________________');
        }
    }

    stateChangeTimeSlot(){
        UI.writeText('DAY // TIME');
    }

    stateChangeDay(){
        UI.writeText('So, 02. Juni');
    }

    stateChangeTime(){
        UI.writeText('10:00');
    }

    stateBack(){
        UI.writeText('Shaaaaaaaaaaake!');
    }

    stateError(){
        UI.writeText('404',2);
    }

}
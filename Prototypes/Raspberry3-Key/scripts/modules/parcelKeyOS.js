// ParcelKey OS

const getGyroData = require('./getGyroData');
const getBeaconDistance = require('./getBeaconDistance');

const UserInterface = require('./ui');
UI = new UserInterface();

let distanceInterval;

module.exports = class pkOS{
    constructor(){
        this.OLDSTATE;
        this.STATE;
        this.DISTANCE;
        this.GYRO
    }
    
    boot(){
        UI.init();
        this.setState('stateStartUp');

        // Run Loop
        setInterval(() => {
            this.checkState();
            this.checkInput();

            // get GYRO Data
            let GyroData = getGyroData();
            if(GyroData.init){
                //console.log(GyroData);
                this.GYRO = GyroData;
            }
            
            // Check UserInput

        }, 300);

        // Beacon / Distance Scanning Loop
        setInterval(() => {
            let BeaconDistance = getBeaconDistance();
            this.DISTANCE = BeaconDistance;
        }, 1000); 
    }

    // INPUT MANAGER

    checkInput(){



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
    }

    stateDistanceMeters(){
        UI.writeDistance(this.DISTANCE);
    }

    stateDistanceMinutes(){
        UI.writeText('10 Minuten');
    }

    stateGyroData(){
        console.log(this.GYRO);
        UI.writeGYRO(this.GYRO);
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
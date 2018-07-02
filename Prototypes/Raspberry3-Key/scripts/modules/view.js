// View: Updates OLED + LED
const events = require('events');
const Ui = require('./ui');
const AmbientLight = require('./ambientLED');


module.exports = class View{
    constructor(){
        this.UI = new Ui();
        this.LIGHT = new AmbientLight(27, 22, 17);
        this.e = new events.EventEmitter();

        this.old_action;

        this.STATE = 'initState';

        // DATA
        this.distanceData = '...';
        this.gyroData = {init: false};

        // STATE OPTIONS
        this.needDistance = false;
        this.needContiGyro = false;
        this.needContiAction = false;

        this.accepted = false;
        this.ordered = false;

        // STATE STORAGE
        this.time = {
            h: 9,
            m: 0
        };
    }
    
    boot(){
        this.updateDisplay();

        // setInterval(()=>{
        //     this.updateDisplay();
        // }, 250);

        this.e.on('newGesture',(action)=>{

            let trackGesture = false;
            // Continous Mode
            if(this.needContiAction){
                if(action == 'left' || action == 'right'){
                    trackGesture = true
                }else{
                    trackGesture = this.old_action != action;
                }
            }else{
                trackGesture = this.old_action != action;
            }
    

            if(trackGesture){
                console.log('trackGesture', trackGesture);
                console.log(action)
                this.updateDisplay(action);
                this.old_action = action;
            }

        });

        this.e.on('newDistanceData',(e) =>{
            this.distanceData = e.toString();
            if(this.needDistance){
                this.updateDisplay();
            }
        })

        this.e.on('newNotification',(e)=>{
            console.log('newNotification', e);
        });
    }

    updateDisplay(action){
        // STATES
        switch (this.STATE) {
            case 'initState':
                this.initState(action);
                break;

            case 'statusState':
                this.statusState(action);
                break;

            case 'distanceState':
                this.distanceState(action);
                break;

            case 'timeslotState':
                this.timeslotState(action);
                break;

            case 'changeTimeState':
                this.changeTimeState(action);
                break;

            case 'gyroState':
                this.gyroState(action);
                break;

            case 'bestellung':
                this.bestellung(action);
                break;

            case 'kontaktanfrage':
                this.kontaktanfrage(action);
                break;

            default:
                break;
        }
    }

    initState(action){
        // STATE Settings
        this.needDistance = false;
        this.needContiGyro = false;

        // OLED
        // this.UI.writeText('PARCELKEY', 2);
        this.UI.writeImg('ParcelKey.png');
        // LIGHT
        this.LIGHT.init();

        // START STATE
        setTimeout(()=>{
            this.STATE = 'statusState'
            this.updateDisplay();
        }, 3000)
    }


    statusState(action){
        // STATE Settings
        this.needDistance = true;
        this.needContiGyro = false;

        // CALCULATION
        let time = '0 Minuten'; 
        if(this.distanceData < 5){
            time = '1 Min'  
        } else {
            time = '5 Min'
        }

        // OLED
        this.UI.writeText(time, 3);
        // LIGHT
        this.LIGHT.ok();

        // Action
        if(action != undefined){
            switch (action) {
                case 'left':
                    // this.UI.writeText('LEFT', 2);
                    this.STATE = 'distanceState'
                    break;

                case 'right':
                    // this.UI.writeText('RIGHT', 2);
                    this.STATE = 'timeslotState'
                    break;

                case 'accept':
                    // this.UI.writeText('ACCEPT', 2);
                    break;

                case 'decline':
                    // this.UI.writeText('DECLINE', 2);
                    break;
            
                default:
                    // this.UI.writeText('NO ACTION', 2);
                    break;
            }
        }
    }


    distanceState(action){
        // STATE Settings
        this.needDistance = true;
        this.needContiGyro = false;

        // OLED
        let disdata = Number(this.distanceData).toFixed(2);
        this.UI.writeText(disdata + 'm', 3);
        // LIGHT
        this.LIGHT.init();

        // Action
        if(action != undefined){
            switch (action) {
                case 'left':
                    // this.UI.writeText('LEFT', 2);
                    this.STATE = 'timeslotState';
                    break;

                case 'right':
                    // this.UI.writeText('RIGHT', 2);
                    this.STATE = 'statusState';
                    break;

                case 'accept':
                    // this.UI.writeText('ACCEPT', 2);
                    break;

                case 'decline':
                    // this.UI.writeText('DECLINE', 2);
                    break;
            
                default:
                    // this.UI.writeText('NO ACTION', 2);
                    break;
            }
        }
    }


    timeslotState(action){
        // STATE Settings
        this.needDistance = false;
        this.needContiGyro = false;

        // OLED
        this.UI.writeText('CHANGE TIMESLOT?', 2);
        // LIGHT
        this.LIGHT.init();

        // Action
        if(action != undefined){
            switch (action) {
                case 'left':
                    // this.UI.writeText('LEFT', 2);
                    this.STATE = 'statusState';
                    
                    break;

                case 'right':
                    // this.UI.writeText('RIGHT', 2);
                    this.STATE = 'distanceState';
                    break;

                case 'accept':
                    // this.UI.writeText('ACCEPT', 2);
                    this.STATE = 'changeTimeState';
                    this.updateDisplay();
                    break;

                case 'decline':
                    // this.UI.writeText('DECLINE', 2);
                    break;
            
                default:
                    // this.UI.writeText('NO ACTION', 2);
                    break;
            }
        }
    }

    changeTimeState(action){
        // STATE Settings
        this.needDistance = false;
        this.needContiGyro = false;
        this.needContiAction = true;

        // Time
        let time = this.time.h + ':' + this.minFix(this.time.m)

        // OLED
        if(this.needContiAction){
            this.UI.writeText(time, 3);
        }else{
            this.UI.writeImg('check.png');
        }
        
        
        // LIGHT
        this.LIGHT.init();

        // Action
        if(action != undefined){
            switch (action) {
                case 'left':
                    this.time.m -= 10;
                    if(this.time.m < 0){
                        this.time.m = 50;
                        this.time.h -= 1;
                    }

                    time = this.time.h + ':' + this.minFix(this.time.m)
                    this.UI.writeText(time, 3);
                    break;

                case 'right':
                    this.time.m += 10;
                    if(this.time.m == 60){
                        this.time.m = 0;
                        this.time.h += 1;
                    }

                    time = this.time.h + ':' + this.minFix(this.time.m)
                    this.UI.writeText(time, 3);
                    break;

                case 'accept':
                    // this.UI.writeText('ACCEPT', 2);
                    this.UI.writeImg('check.png');
                    this.needContiAction = false;
                    setTimeout(()=>{
                        this.STATE = 'statusState';
                        this.updateDisplay();
                    }, 3000)
 
                    break;

                case 'decline':
                    // this.STATE = 'statusState';
                    // this.UI.writeText('DECLINE', 2);
                    break;
            
                default:
                    // this.UI.writeText('NO ACTION', 2);
                    break;
            }
        }
    }

    bestellung(action){
        if(!this.ordered){
            this.UI.writeImg('order.png');
        }else{
            this.UI.writeImg('check.png');
        }
        
        setTimeout(()=>{
           this.ordered = true;
        }, 3000)
        setTimeout(()=>{
            this.STATE = 'statusState';
            this.ordered = false;
        }, 5000)
    }

    kontaktanfrage(action){
        
        if(!this.accepted){
            this.UI.writeImg('contact.png');
            this.LIGHT.problem();
        }else{
            this.UI.writeImg('check.png');
            this.LIGHT.ok();
        }
        

        // Action
        if(action != undefined){
        switch (action) {
            case 'left':
                // this.UI.writeText('LEFT', 2);
                break;

            case 'right':
                // this.UI.writeText('RIGHT', 2);
                break;

            case 'accept':
                // this.UI.writeText('ACCEPT', 2);
                this.accepted = true;
                setTimeout(()=>{
                    this.accepted = false;
                    this.STATE = 'statusState';
                }, 3000)
                break;

            case 'decline':
                // this.UI.writeText('DECLINE', 2);
                break;
        
            default:
                // this.UI.writeText('NO ACTION', 2);
                break;
        }
    }
    }

    // #### HELPERS ###



    minFix(m){
        if(m < 10){
            return '0' + m
        }else{
            return m
        }
    }

    // #### TEST STATES ###

    gyroState(action){
        // GYRO STATE TEST
        // STATE Settings
        this.needDistance = false;
        this.needContiGyro = true; // SET TRUE for multiple same Inputs

        if(this.gyroData.init){
            // console.log('GS:',this.gyroData);
            // OLED
            this.UI.writeGYRO(this.gyroData);
        }

        // LIGHT
        this.LIGHT.init();

        if(action != undefined){
                console.log('action', action);
            // Action
            // switch (action) {
            //     case 'left':
            //         // this.UI.writeText('LEFT', 2);
            //         break;

            //     case 'right':
            //         // this.UI.writeText('RIGHT', 2);
            //         break;

            //     case 'accept':
            //         // this.UI.writeText('ACCEPT', 2);
            //         break;

            //     case 'decline':
            //         // this.UI.writeText('DECLINE', 2);
            //         break;
            
            //     default:
            //         // this.UI.writeText('NO ACTION', 2);
            //         break;
            // }
        }
    }


}
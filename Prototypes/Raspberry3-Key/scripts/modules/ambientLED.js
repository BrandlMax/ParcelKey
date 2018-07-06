var Gpio = require('pigpio').Gpio;

//17, 27, 22
module.exports = class UI {
    constructor(BCMr, BCMg, BCMb) {
        this.ledRed = new Gpio(BCMr, {
            mode: Gpio.OUTPUT
        });
        this.ledGreen = new Gpio(BCMg, {
            mode: Gpio.OUTPUT
        });
        this.ledBlue = new Gpio(BCMb, {
            mode: Gpio.OUTPUT
        });
    }

    init() {
        this.ledRed.pwmWrite(0);
        this.ledGreen.pwmWrite(0);
        this.ledBlue.pwmWrite(255);
    }

    standby() {
        this.ledRed.pwmWrite(0);
        this.ledGreen.pwmWrite(0);
        this.ledBlue.pwmWrite(0);
    }

    ok() {
        this.ledRed.pwmWrite(0);
        this.ledGreen.pwmWrite(255);
        this.ledBlue.pwmWrite(0);
    }

    problem() {
        // this.ledRed.digitalWrite(0);
        // this.ledGreen.digitalWrite(0);
        // this.ledBlue.digitalWrite(0);

        // Light Up
        this.ledRed.pwmWrite(255);
        this.ledGreen.pwmWrite(0);
        this.ledBlue.pwmWrite(0);

    }
}
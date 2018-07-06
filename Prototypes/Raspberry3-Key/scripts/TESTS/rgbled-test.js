var Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO

    ledRed = new Gpio(27, {
        mode: Gpio.OUTPUT
    }), //use GPIO pin 4 as output for RED
    ledGreen = new Gpio(22, {
        mode: Gpio.OUTPUT
    }), //use GPIO pin 17 as output for GREEN
    ledBlue = new Gpio(17, {
        mode: Gpio.OUTPUT
    }), //use GPIO pin 27 as output for BLUE

    redRGB = 0,
    greenRGB = 255,
    blueRGB = 0;

ledRed.digitalWrite(1);
ledGreen.digitalWrite(1);
ledBlue.digitalWrite(1);

ledRed.pwmWrite(redRGB); //set RED LED to specified value
ledGreen.pwmWrite(greenRGB); //set GREEN LED to specified value
ledBlue.pwmWrite(blueRGB); //set BLUE LED to specified value

process.on('SIGINT', function () { //on ctrl+c
    ledRed.digitalWrite(0); // Turn RED LED off
    ledGreen.digitalWrite(0); // Turn GREEN LED off
    ledBlue.digitalWrite(0); // Turn BLUE LED off
    process.exit(); //exit completely
});
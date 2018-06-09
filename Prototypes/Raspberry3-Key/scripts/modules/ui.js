const i2c = require('i2c-bus');
const oledi2c = require('oled-i2c-bus');
const oledFont = require('oled-font-5x7');

module.exports = class UI{
    constructor(){
        const i2cBus = i2c.openSync(1);
        this.oled = new oledi2c(i2cBus, {
            width: 128,
            height: 32,
            address: 0x3C,
        });
    }

    init(){
        this.oled.clearDisplay();
        this.oled.turnOnDisplay();

        this.oled.setCursor(1, 1);
        this.oled.writeString(oledFont, 2, 'PARCELKEY˚', 1, true);

        // LED.init();
    }

    /**
     * Write Current Distance
     * @param {*} distance 
     */
    writeDistance(distance, size = 2){
        this.oled.clearDisplay();
        this.oled.setCursor(1, 1);
        this.oled.writeString(oledFont, size, `${distance}`.substr(0, 4) + 'm', 1, true);
    }

    /**
     * Write Text to LCD
     * @param {String} text 
     * @param {number} size 
     */
    writeText(text, size = 1){
        this.oled.clearDisplay();
        this.oled.setCursor(1, 1);
        this.oled.writeString(oledFont, size, text, 1, true);
    }

    standBy(){
        this.oled.clearDisplay();
    }

    writeGYRO(gyroData){

        gyroData
        this.oled.clearDisplay();

        this.oled.setCursor(1, 1);
        let gX = Math.round(gyroData.gyro.x * 100) / 100;
        this.oled.writeString(oledFont, 1, `gX:${gX}`, 1, true);
        
        this.oled.setCursor(1, 10);
        let gY = Math.round(gyroData.gyro.y * 100) / 100;
        this.oled.writeString(oledFont, 1, `gY:${gY}`, 1, true);

        this.oled.setCursor(1, 20);
        let gZ = Math.round(gyroData.gyro.z * 100) / 100;
        this.oled.writeString(oledFont, 1, `gZ:${gZ}`, 1, true);


        this.oled.setCursor(60, 1);
        let aX = Math.round(gyroData.accel.x * 100) / 100;
        this.oled.writeString(oledFont, 1, `aX:${aX}`, 1, true);
        
        this.oled.setCursor(60, 10);
        let aY = Math.round(gyroData.accel.y * 100) / 100;
        this.oled.writeString(oledFont, 1, `aY:${aY}`, 1, true);

        this.oled.setCursor(60, 20);
        let aZ = Math.round(gyroData.accel.z * 100) / 100;
        this.oled.writeString(oledFont, 1, `aZ:${aZ}`, 1, true);
        
    }

    test(test){
        console.log('UI TEST:', test);
    }
}

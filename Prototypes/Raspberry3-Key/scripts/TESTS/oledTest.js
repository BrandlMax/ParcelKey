var i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(1),
    oled = require('oled-i2c-bus'),
    font = require('oled-font-5x7');

var opts = {
    width: 128,
    height: 32,
    address: 0x3C
};

var oled = new oled(i2cBus, opts);

// do cool oled things here
oled.clearDisplay();
oled.turnOnDisplay();
oled.fillRect(0, 0, 128, 32, 1);
oled.clearDisplay();

oled.setCursor(1, 1);
oled.writeString(font, 2, "Danke Flo", 1, true);

console.log("v0.0.1");
// PARCELKEY SCRIPT

// IMPORTS
const io = require('socket.io-client');

const i2c = require('i2c-bus');
const oledi2c = require('oled-i2c-bus');
const oledFont = require('oled-font-5x7');

const getGyroData = require('./modules/getGyroData');
const getBeaconDistance = require('./modules/getBeaconDistance');

const test = require('./modules/test');
test("Hello Module");

process.setMaxListeners(0);

// URL / PORTS
// Home
var url = '192.168.0.27'
// Uni
// var url = '192.168.0.80'


// INIT OLED
const i2cBus = i2c.openSync(1);
const oled = new oledi2c(i2cBus, {
    width: 128,
    height: 32,
    address: 0x3C,
});

oled.clearDisplay();
oled.turnOnDisplay();

oled.setCursor(1, 1);
oled.writeString(oledFont, 2, 'Init Gyro...', 1, true);


// LOOPS
// GyroData Loop
setInterval(() => {
    let GyroData = getGyroData();
    if(GyroData.init){
        console.log(GyroData);
    }
}, 300);

// Beacon Scanning Loop
setInterval(() => {
    let BeaconDistance = getBeaconDistance();
    oled.clearDisplay();
    oled.setCursor(1, 1);
    oled.writeString(oledFont, 1, `${BeaconDistance}`.substr(0, 4) + 'm', 1, true);
}, 1000);


// SOCKET SERVER
const socket = io('http://'+ url +':3000');

socket.emit('testchannel', 'Hello from RaspberryPi 3');

socket.on('testchannel', function(msg){
    console.log('testchannel: ' + msg);
});

socket.on('toParcelKey', function(msg){
    console.log('toParcelKey: ' + msg);
});

console.log('Running');

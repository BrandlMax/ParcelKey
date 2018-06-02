// PARCELKEY SCRIPT

// IMPORTS
const io = require('socket.io-client');

const i2c = require('i2c-bus');
const oledi2c = require('oled-i2c-bus');
const mpu9250 = require('mpu9250');
const oledFont = require('oled-font-5x7');
const fs = require('fs');
const path = require('path');
const noble = require('noble');
const KalmanFilter = require('kalmanjs').default;

const getGyroOffset = require('./modules/calibrate-gyro');
const getGyroData = require('./modules/getGyroData');
const getDistance = require('./modules/getDistance');

const kf = new KalmanFilter();

const test = require('./modules/test');
test("Hello Module");

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


// GYRO
const accelJson = fs.readFileSync(path.resolve(__dirname, 'accel.json'));
const ACCEL_CALIBRATION = JSON.parse(accelJson);
const mpu = new mpu9250({
    device: '/dev/i2c-1',
    DEBUG: false,
    GYRO_FS: 0,
    ACCEL_FS: 0,
    scaleValues: true,
    gyroBiasOffset: getGyroOffset(),
    accelCalibration: ACCEL_CALIBRATION,
});

function GyroListener(){
    let GyroData = getGyroData(mpu);
    console.log(GyroData);
}

// BEACON TRACKING
noble.on('discover', function(peripheral) { 
    var macAddress = peripheral.uuid;
    var rss = peripheral.rssi;
    //var localName = advertisement.localName; 
    //console.log('found device: ', macAddress, ' ', ' ', rss);
    if(macAddress.substr(-2) === 'b5') {
        const distance = kf.filter(getDistance(rss));
        oled.clearDisplay();
        oled.setCursor(1, 1);
        oled.writeString(oledFont, 1, `${distance}`.substr(0, 4) + 'm', 1, true);
    }
});

// GyroData Loop
if (mpu.initialize()) {
    setInterval(GyroListener, 300);
}
// BeaconTracking Loop
setInterval(() => {
    noble.startScanning([]);
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

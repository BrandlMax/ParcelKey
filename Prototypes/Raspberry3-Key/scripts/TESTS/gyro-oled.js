const i2c = require('i2c-bus');
const oledi2c = require('oled-i2c-bus');
const mpu9250 = require('mpu9250');
const oledFont = require('oled-font-5x7');
const fs = require('fs');
const path = require('path');
const noble = require('noble');
const KalmanFilter = require('kalmanjs').default;

const getGyroOffset = require('./modules/calibrate-gyro');
 
const kf = new KalmanFilter();

// OLED
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

let cnt = 0;
let lastMag = [0, 0, 0];
let counter = 0;

oled.clearDisplay();
oled.setCursor(1, 1);
oled.writeString(oledFont, 1, `Schüttel das Baby: ${counter}`, 1, true);

function calculateDistance(rssi) {
    var txPower = -59 //hard coded power value. Usually ranges between -59 to -65

    if (rssi == 0) {
        return -1.0; 
    }

    var ratio = rssi*1.0/txPower;
    if (ratio < 1.0) {
        return Math.pow(ratio,10);
    }
    else {
        var distance =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
        return distance;
    }
} 

function getGyroData() {
    const start = new Date().getTime();
    let m9;

    // Only get the magnetometer values every 100Hz
    const getMag = cnt++ % 2;
    if (getMag) {
        m9 = mpu.getMotion6().concat(lastMag);
    } else {
        m9 = mpu.getMotion9();
        lastMag = [m9[6], m9[7], m9[8]];
    }
    const end = new Date().getTime();
    const t = (end - start) / 1000;

    const gyro = {
        x: m9[3],
        y: m9[4],
        z: m9[5],
    };

    const accel = {
        x: m9[0],
        y: m9[1],
        z: m9[2],
    };

    // if (Math.abs(gyro.x) >= 200) {
    //     counter += 1;
    //     oled.clearDisplay();
    //     oled.setCursor(1, 1);
    //     oled.writeString(oledFont, 1, `Schüttel das Baby: ${counter}`, 1, true);
    // }

    // if (Math.abs(gyro.z) >= 100) {
    //     counter = 0;
    // }

    if (Math.abs(accel.x) >= 0.90) {
        counter += 1;
        oled.clearDisplay();
        oled.setCursor(1, 1);
        oled.writeString(oledFont, 1, `Drehe das Baby (x): ${counter}`, 1, true);
    }

    console.log(Math.abs(accel.z) >= 0.90);
    if (Math.abs(accel.z) >= 0.90) {
        counter = 0;
    }

    console.log(accel);
}

noble.on('discover', function(peripheral) { 
    var macAddress = peripheral.uuid;
    var rss = peripheral.rssi;
    //var localName = advertisement.localName; 
    //console.log('found device: ', macAddress, ' ', ' ', rss);
    if(macAddress.substr(-2) === 'b5') {
        const distance = kf.filter(calculateDistance(rss));
        oled.clearDisplay();
        oled.setCursor(1, 1);
        oled.writeString(oledFont, 1, `${distance}`.substr(0, 4) + 'm', 1, true);
    }
});
  

if (mpu.initialize()) {
    setInterval(getGyroData, 300);
}

// BLUE
setInterval(() => {
    noble.startScanning([]);
}, 1000);
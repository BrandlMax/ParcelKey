// GET GYRO DATA
const fs = require('fs');
const path = require('path');
const mpu9250 = require('mpu9250');

const getGyroOffset = require('./calibrate-gyro');

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

function getGyroData() {
    if (mpu.initialize()) {
        const start = new Date().getTime();
        let m9;

        // Only get the magnetometer values every 100Hz
        const getMag = cnt++ % 2;
        // if (getMag) {
        //     m9 = mpu.getMotion6().concat(lastMag);
        // } else {
        //     m9 = mpu.getMotion9();
        //     lastMag = [m9[6], m9[7], m9[8]];
        // }

        m9 = mpu.getMotion9();
        lastMag = [m9[6], m9[7], m9[8]];

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

        return {
            init: true,
            gyro,
            accel
        };
    } else {
        return {
            init: false,
            gyro,
            accel
        };
    }
}

module.exports = () => {
    return getGyroData();
};
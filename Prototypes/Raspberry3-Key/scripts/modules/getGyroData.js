let cnt = 0;
let lastMag = [0, 0, 0];

function getGyroData(mpu) {
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

    return {gyro, accel};

    // console.log(accel);
}

// Show Data
    // if (Math.abs(gyro.x) >= 200) {
    //     counter += 1;
    //     oled.clearDisplay();
    //     oled.setCursor(1, 1);
    //     oled.writeString(oledFont, 1, `Schüttel das Baby: ${counter}`, 1, true);
    // }

    // if (Math.abs(gyro.z) >= 100) {
    //     counter = 0;
    // }

    // if (Math.abs(accel.x) >= 0.90) {
    //     counter += 1;
    //     oled.clearDisplay();
    //     oled.setCursor(1, 1);
    //     oled.writeString(oledFont, 1, `Drehe das Baby (x): ${counter}`, 1, true);
    // }

    // console.log(Math.abs(accel.z) >= 0.90);
    // if (Math.abs(accel.z) >= 0.90) {
    //     counter = 0;
    // }

module.exports = (mpu) => {
    return getGyroData(mpu);
};
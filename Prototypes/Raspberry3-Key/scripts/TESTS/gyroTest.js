var mpu9250 = require('mpu9250');
var timer = 0;
var mpu = new mpu9250({
    // i2c path (default is '/dev/i2c-1')
    device: '/dev/i2c-1',

    // mpu9250 address (default is 0x68)
    address: 0x68,

    // Enable/Disable magnetometer data (default false)
    UpMagneto: true,

    // If true, all values returned will be scaled to actual units (default false).
    // If false, the raw values from the device will be returned.
    scaleValues: false,

    // Enable/Disable debug mode (default false)
    DEBUG: false,

    // ak8963 (magnetometer / compass) address (default is 0x0C)
    ak_address: 0x0C,

    // Set the Gyroscope sensitivity (default 0), where:
    //      0 => 250 degrees / second
    //      1 => 500 degrees / second
    //      2 => 1000 degrees / second
    //      3 => 2000 degrees / second
    GYRO_FS: 0,

    // Set the Accelerometer sensitivity (default 2), where:
    //      0 => +/- 2 g
    //      1 => +/- 4 g
    //      2 => +/- 8 g
    //      3 => +/- 16 g
    ACCEL_FS: 2
});

var kalmanX = new mpu.Kalman_filter();
var kalmanY = new mpu.Kalman_filter();

function getData(){
	var values = mpu.getMotion9();
	var pitch = mpu.getPitch(values);
	var roll = mpu.getRoll(values);
	var yaw = mpu.getYaw(values);

    kalmanX.setAngle(roll);
    kalmanY.setAngle(pitch);
    
    var kalAngleX = 0,
        kalAngleY = 0,
        kalAngleZ = 0,
        gyroXangle = roll,
        gyroYangle = pitch,
        gyroZangle = yaw,
        gyroXrate = 0,
        gyroYrate = 0,
        gyroZrate = 0,
        compAngleX = roll,
        compAngleY = pitch,
        compAngleZ = yaw;

    var gyroXrate = values[3] / 131.0;
    var gyroYrate = values[4] / 131.0;
    var gyroZrate = values[5] / 131.0;

    var micros = function() {
		return new Date().getTime();
	};
	var dt = 0;

	timer = micros();

    var dt = (micros() - timer) / 1000000;
	    timer = micros();

        if ((roll < -90 && kalAngleX > 90) || (roll > 90 && kalAngleX < -90)) {
            kalmanX.setAngle(roll);
            compAngleX = roll;
            kalAngleX = roll;
            gyroXangle = roll;
        } else {
            kalAngleX = kalmanX.getAngle(roll, gyroXrate, dt);
        }

        if (Math.abs(kalAngleX) > 90) {
            gyroYrate = -gyroYrate;
        }
        kalAngleY = kalmanY.getAngle(pitch, gyroYrate, dt);

        gyroXangle += gyroXrate * dt;
        gyroYangle += gyroYrate * dt;
        compAngleX = 0.93 * (compAngleX + gyroXrate * dt) + 0.07 * roll;
        compAngleY = 0.93 * (compAngleY + gyroYrate * dt) + 0.07 * pitch;

        if (gyroXangle < -180 || gyroXangle > 180) gyroXangle = kalAngleX;
        if (gyroYangle < -180 || gyroYangle > 180) gyroYangle = kalAngleY;

        var accel = {
            pitch: compAngleY,
            roll: compAngleX
        };

        console.log({
            gyroXangle, gyroYangle, gyroZangle
        })
}

if (mpu.initialize()) {
    setInterval(getData, 300);
}
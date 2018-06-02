const mpu9250 = require('mpu9250');
const sleep = require('sleep');

const NUM_READS = 500;

const mpu = new mpu9250({
    device: '/dev/i2c-1',
    scaleValues: true,
    UpMagneto: false
});

function gyroBiasCalibrationSync() {
	const avg = {
		x: 0,
		y: 0,
		z: 0
	};

	for (var i = 0; i < NUM_READS; i++) {
		var gyroValues = mpu.getGyro();
		avg.x += gyroValues[0];
		avg.y += gyroValues[1];
		avg.z += gyroValues[2];
		sleep.usleep(5000);
	}

	avg.x /= -NUM_READS;
	avg.y /= -NUM_READS;
	avg.z /= -NUM_READS;

	return avg;
}

module.exports = () => {
    if (mpu.initialize()) {
        return gyroBiasCalibrationSync();
    }
};
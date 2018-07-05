// Check Gestures: Detect Gestures
let events = require('events');

module.exports = class View {
    constructor() {
        this.e = new events.EventEmitter();

        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    check(GYRO) {
        let input = 'none';
        // console.log('GYRODATA', GYRO);

        // Detect Left
        if (GYRO.accel.x > 0.60 && GYRO.accel.y < 0.85) {
            input = 'left';
            this.e.emit('gestureDetected', input);
        }

        // Detect Right
        if (GYRO.accel.x < -0.60 && GYRO.accel.y < 0.85) {
            input = 'right';
            this.e.emit('gestureDetected', input);
        }

        // Detect Accept
        if (GYRO.accel.z < -0.6) {
            this.up = true;
            if (this.up && this.down) {
                input = 'accept';
                this.e.emit('gestureDetected', input);
                this.up = false;
                this.down = false;
            }
        }

        if (GYRO.accel.z > 0.15) {
            this.down = true;
            if (this.up && this.down) {
                input = 'accept';
                this.e.emit('gestureDetected', input);
                this.up = false;
                this.down = false;
            }
        }

        // Detect Decline
        if (GYRO.accel.x < -0.10 && GYRO.accel.y > 0.85) {
            this.left = true;
            if (this.left && this.right) {
                input = 'decline';
                this.e.emit('gestureDetected', input);
                this.left = false;
                this.right = false;
            }
        }

        if (GYRO.accel.x < 0.3 && GYRO.accel.y > 0.85) {
            this.right = true;
            if (this.left && this.right) {
                input = 'decline';
                this.e.emit('gestureDetected', input);
                this.left = false;
                this.right = false;
            }
        }


    }
}
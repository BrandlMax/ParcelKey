var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Uni Netzwerk
var url = '172.16.19.243'

app.use(express.static(__dirname + '/ParcelKeySim' ));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/ParcelKeySim/');
});

io.on('connection', function(socket){
    console.log('a user connected');
  
    socket.emit('testchannel','Hello from j5 Server');

    socket.on('testchannel', function(msg){
      console.log('testchannel: ' + msg);
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});

function sendToClient(data){
    io.sockets.emit('GYRO', data);
}

http.listen(1337, url, function(){
    console.log('listening on *:1337');
});

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var imu = new five.IMU({
    controller: "MPU6050"
  });

  imu.on("change", function() {
    sendToClient({
        accelerometer: {
            x: this.accelerometer.x,
            y: this.accelerometer.y,
            z: this.accelerometer.z,
            pitch: this.accelerometer.pitch,
            roll: this.accelerometer.roll,
            acceleration: this.accelerometer.acceleration,
            inclination: this.accelerometer.inclination,
            orientation: this.accelerometer.orientation,
        },
        gyro: {
            x: this.gyro.x,
            y: this.gyro.y,
            z: this.gyro.z,
            pitch: this.gyro.pitch,
            roll: this.gyro.roll,
            yaw: this.gyro.yaw,
            rate: this.gyro.rate,
            isCalibrated: this.gyro.isCalibrated,
        }
    });
    // console.log("Thermometer");
    // console.log("  celsius      : ", this.thermometer.celsius);
    // console.log("  fahrenheit   : ", this.thermometer.fahrenheit);
    // console.log("  kelvin       : ", this.thermometer.kelvin);
    // console.log("--------------------------------------");

    // console.log("Accelerometer");
    // console.log("  x            : ", this.accelerometer.x);
    // console.log("  y            : ", this.accelerometer.y);
    // console.log("  z            : ", this.accelerometer.z);
    // console.log("  pitch        : ", this.accelerometer.pitch);
    // console.log("  roll         : ", this.accelerometer.roll);
    // console.log("  acceleration : ", this.accelerometer.acceleration);
    // console.log("  inclination  : ", this.accelerometer.inclination);
    // console.log("  orientation  : ", this.accelerometer.orientation);
    // console.log("--------------------------------------");

    // console.log("Gyroscope");
    // console.log("  x            : ", this.gyro.x);
    // console.log("  y            : ", this.gyro.y);
    // console.log("  z            : ", this.gyro.z);
    // console.log("  pitch        : ", this.gyro.pitch);
    // console.log("  roll         : ", this.gyro.roll);
    // console.log("  yaw          : ", this.gyro.yaw);
    // console.log("  rate         : ", this.gyro.rate);
    // console.log("  isCalibrated : ", this.gyro.isCalibrated);
    // console.log("--------------------------------------");

  });
});
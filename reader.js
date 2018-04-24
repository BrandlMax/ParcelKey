const raspi = require('raspi-io');
const five = require('johnny-five');

// Serial Port Reader for Parallax RFID
var SerialPort = require('serialport');

// port.read();

// port.on('readable', function () {
//     console.log('Data?');
// });

// Raspberry Board
const board = new five.Board({
  io: new raspi()
});

board.on('ready', () => {

    console.log('Board Ready');


    SerialPort.list(function (err, ports) {
        ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
        console.log(port.productId);
        console.log(port.serialNumber);
        });
    });

    //All communication is 8 data bits, no parity, 1 stop bit, and least significant bit first (8N1) at 2400 bps. 
    var port = new SerialPort('/dev/ttyUSB0',{

    },function (err) {
        if (err) {
          return console.log('Error: ', err.message);
        }
    });

    port.on('open', function (data) {
        console.log('open:', data);
    });

    port.on('readable', function () {
        console.log('Data:', port.read());
    });

    // port.write('main screen turn on');

    // port.on('data', function (data) {
    //     console.log('Data:', data);
    // });
    
    // port.on('error', function(err) {
    //     console.log('Error: ', err.message);
    // })

    // port.read(function(data){
    //     console.log('Data:', data);
    // });

});


var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

module.exports = class LED{
    constructor(){
        this.notification = false;
        this.warn = false;
        this.ok = false;
        this.ready = false;
    }

    init(){
        // http://johnny-five.io/examples/raspi-io/
        // https://github.com/nebrius/raspi-io/wiki/Pin-Information
        board.on("ready", () => {
            this.ready = true;

            var led = new five.Led("P1-13");
            led.blink();
        });
    }

    notification(){
        console.log('Notification Light');
    }

    warn(){
        console.log('Warn Light');
    }

    ok(){
        console.log('Notification Light');
    }
}
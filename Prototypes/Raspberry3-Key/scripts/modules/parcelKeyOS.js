// ParcelKey OS
var events = require('events');
const Controller = require('./controller');

module.exports = class pkOS {
    constructor() {
        this.CONTROLLER = new Controller();
        this.e = new events.EventEmitter();
    }

    boot() {
        this.CONTROLLER.boot();

        this.e.on('notification', (e) => {
            console.log('notification', e);
            if (e == 'Kontaktanfrage!') {
                this.CONTROLLER.VIEW.STATE = 'kontaktanfrage';
            }

            // EaserEgg :)
            if (e == 'Paketannahme!Cat') {
                this.CONTROLLER.VIEW.STATE = 'paketannahmecat';
            }

            if (e == 'Paketannahme!') {
                this.CONTROLLER.VIEW.STATE = 'paketannahme';
            }

            if (e == 'New Delivery!') {
                this.CONTROLLER.VIEW.STATE = 'bestellung';
            }
        })
    }

}
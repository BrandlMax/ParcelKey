// BEACON TRACKING
const noble = require('noble');
const KalmanFilter = require('kalmanjs').default;

const kf = new KalmanFilter();

const getDistance = require('./getDistance');

let onState;
noble.on('stateChange', function (state) {
    console.log(state);
    onState = state
});

let distance;
noble.on('discover', function (peripheral) {
    var macAddress = peripheral.uuid;
    var rss = peripheral.rssi;
    //var localName = advertisement.localName; 
    //console.log('found device: ', macAddress, ' ', ' ', rss);
    if (macAddress.substr(-2) === 'b5') {
        distance = kf.filter(getDistance(rss));
        return distance;
        // oled.clearDisplay();
        // oled.setCursor(1, 1);
        // oled.writeString(oledFont, 1, `${distance}`.substr(0, 4) + 'm', 1, true);
    } else {
        return "Searching Beacon..."
    }
});



module.exports = () => {

    // console.log(noble.state);

    if (noble.state == "poweredOn") {
        noble.startScanning([]);
    }

    if (distance != undefined) {
        return distance;
    } else {
        return "...";
    }

};
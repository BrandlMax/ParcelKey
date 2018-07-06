function scanBluetooth() {
    navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            // optionalServices: ['battery_service']
        })
        .then(device => {
            console.log(device);
            console.log(device.name);
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Getting Service...');
            return server.getPrimaryService();
        })
        .then(service => {
            console.log('GetChar', service.getCharacteristics());
            return service.getCharacteristics();
        })
        .then(characteristic => {
            // Set up event listener for when characteristic value changes.
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                console.log(event)
            })
        })
        .catch(error => {
            console.log(error);
        });
}
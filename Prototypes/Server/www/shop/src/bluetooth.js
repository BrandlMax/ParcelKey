function onButtonClick() {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        // optionalServices: ['battery_service']
    })
    .then(device => { /* ... */
        console.log(device);
    })
    .catch(error => { console.log(error); });
  }
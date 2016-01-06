/*jslint node:true,vars:true,bitwise:true,unparam:true */

/* rfkill unblock bluetooth
 * killall bluetoothd
 * hciconfig hci0 up
 */

// Using the noble module
var noble = require('noble');
var display = require('intel-edison-lcd-rgb-backlight-display-helper');
var groveSensor = require('jsupm_grove');
var lightSensor = new groveSensor.GroveLight(0);
var led = new groveSensor.GroveLed(8);
var button = new groveSensor.GroveButton(5);

// Set display rows/cols
display.set(2, 16);
// Set backlight color from 2 colors and range
display.setColorFromTwoColors('green', 'yellow', 0.5);
display.write('Loading...');

var flag = false;

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning();
        console.log('Started!');
        display.write([null, 'Started...']);
        var checkInterval = setInterval(function () {
            if (button.value()) {
                noble.stopScanning();
                led.off();
                flag = true;
                display.write(['Stopped!','']);
                clearInterval(checkInterval);
            }
            if (!flag) {
                led.off();
                console.log('Time out!');
                display.write([null, 'Time out!']);
            }
            flag = false;
        }, 4500);
    } else {
        noble.stopScanning();
        flag = true;
    }
});

noble.on('discover', function (peripheral) {
    if (peripheral.advertisement.localName === 'MI') {
        flag = true;
        noble.stopScanning();
        console.log('RSSI: ' + peripheral.rssi + '; ' + lightSensor.value() + ' lux');
        display.write([lightSensor.value() + ' lux', 'RSSI: ' + peripheral.rssi]);
        CheckValues(lightSensor.value(), peripheral.rssi);
    }
});

function CheckValues(light, rssi) {
    if (light < 2 & rssi > -88) {
        led.on();
    } else {
        led.off();
    }
    noble.startScanning();
}

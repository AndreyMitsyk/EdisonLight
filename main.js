/*jslint node:true, vars:true, bitwise:true, unparam:true */

// Initialize libraries.
var mraa = require('mraa');
var groveSensor = require('jsupm_grove');
var ms = require('microseconds');

// Declare grove devices.
var lightSensor = new groveSensor.GroveLight(0);
var led = new groveSensor.GroveLed(8);

// Configure ultrasonic sensor.
var echoPin = new mraa.Gpio(6);
var trigPin = new mraa.Gpio(7);
trigPin.dir(mraa.DIR_OUT);
echoPin.dir(mraa.DIR_IN);

// Declare variables.
var maximumRange = 400;
var minimumRange = 4;
var minimumLight = 2;
var activateDistance = 70;
var flag = false;

// TODO: remove display after debug.
var display = require('intel-edison-lcd-rgb-backlight-display-helper');
display.set(2, 16);
display.setColorFromTwoColors('green', 'yellow', 0.5);

// Sets microseconds delay.
function usleep(us) {
    var start = ms.now();
    while (true) {
        if (ms.since(start) > us) {
            return;
        }
    }
}

// Counts the distance with help of ultrasonic sensor.
var ReadSensor = function() {
    var pulseOn, pulseOff;
    var duration, distance;
    
    trigPin.write(0);
    usleep(2);
    trigPin.write(1);
    usleep(10);
    trigPin.write(0);
    
    while (echoPin.read() === 0) {
        pulseOff = ms.now();
    }
    while (echoPin.read() === 1) {
        pulseOn = ms.now();
    }
    duration = pulseOn - pulseOff;
    distance = parseInt(duration / 58.2);
    
    if (distance >= maximumRange || distance <= minimumRange) {
        // TODO: remove display after debug.
        display.write([lightSensor.value() + ' lux', 'Out of range']);
    } else {
        // TODO: remove display after debug.
        display.write([lightSensor.value() + ' lux', distance + ' cm']);

        CheckValues(lightSensor.value(), distance);
    }
};

// Dirty hack! Resolve this.
var timeout = new Array();

// Compares the values with the sensors with specified constants.
function CheckValues(light, distance) {
    if (light < minimumLight && distance <= activateDistance) {
        var temp = setTimeout(function() {
            LightOn();
        }, 2000);
        timeout.push(temp);
        return;
    }
    if (timeout.length > 0) {
        for(var i=0; i<timeout.length; i++) {
            clearTimeout(timeout[i]); 
        }
    }
}

// Activates the relay module.
function LightOn() {
    if (!flag) {
        flag = true;
        // Closes the contact on the wireless controller.
        led.on();
        setTimeout(function() {
            led.off();
            flag = false;
        }, 500);
    }
}

setInterval(ReadSensor, 60);
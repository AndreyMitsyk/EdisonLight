/*jslint node:true, vars:true, bitwise:true, unparam:true */
"use strict";

// Initialize libraries.
var mraa = require('mraa');
var ms = require("microseconds");
var cylon = require("cylon");

// Configure ultrasonic sensor.
var echoPin = new mraa.Gpio(6);
var trigPin = new mraa.Gpio(7);
trigPin.dir(mraa.DIR_OUT);
echoPin.dir(mraa.DIR_IN);

// Declare variables.
var maximumRange = 400;
var minimumRange = 4;
var minimumLight = 50;
var activateDistance = 200;
var flag = false;
var timeout;

cylon.robot({
    name: "SmartLightCylon",
    connections: {
        edison: { adaptor: "intel-iot" }
    },

    devices: {
        // Digital sensors.
        button: { driver: "button", pin: 4, connection: "edison" },
        relay: { driver: 'relay', pin: 8, type: "open" },
        // Analog sensors.
        lightSensor: { driver: "analogSensor", pin: 0, connection: "edison" }
    },
    
    // Sets microseconds delay.
    usleep: function(us) {
        var start = ms.now();
        while (true) {
            if (ms.since(start) > us) {
                return;
            }
        }
    },
    
    // Counts the distance with help of ultrasonic sensor.
    readRange: function() {
        var that = this;
        var pulseOn, pulseOff;
        var duration, distance;
        
        trigPin.write(0);
        that.usleep(2);
        trigPin.write(1);
        that.usleep(10);
        trigPin.write(0);

        while (echoPin.read() === 0) {
            pulseOff = ms.now();
        }
        while (echoPin.read() === 1) {
            pulseOn = ms.now();
        }

        duration = pulseOn - pulseOff;
        distance = parseInt(duration / 58.2);
        
        if (distance < maximumRange && distance > minimumRange) {
            that.checkValues(that.lightSensor.analogRead(), distance);
        }
    },
    
    // Compares the values with the sensors with specified constants.
    checkValues: function(light, distance) {
        var that = this;
        
        if (light < minimumLight && distance <= activateDistance) {
            // If the timeout is reset set a new one.
            if (!!!timeout) {
                // The sensor reacts to the change in the distance over 2 seconds.
                timeout = setTimeout(function() {
                   that.lightOn();
                }, 500);
            }
            return;
        }
        // Reset timeout if distance increases.
        clearTimeout(timeout);
        timeout = null;
    },
    
    // Activates the relay module.
    lightOn: function() {
        var that = this;
        
        if (!flag) {
            flag = true;
            // Closes the contact on the wireless controller.
            that.relay.turnOn();
            setTimeout(function() {
                that.relay.turnOff();
                flag = false;
            }, 200);
        }
    },
    
    // Main function.
    work: function() {
        var that = this;
        
        // Button press event.
        that.button.on('push', function() {
            that.lightOn();
        });
        
        // Interval for the work of ultrasonic sensor.
        setInterval(function() {
            that.readRange();
        }, 60);
    }
}).start();
# EdisonLight
Lighting control through the Edison board.

##### N.B. For the demonstration instead of the relay in the projects I used the LED.

* In the "master" branch a version of the light control via light sensor and ultrasonic ranger.

* In the "smartLight_cylon" branch a version of the light control via light sensor and ultrasonic ranger with help of cylon.js library.

* In the "ble" branch a version of the light control via Edison ble (Bluetooth low energy) and some ble device (e.g. mi band).
You need to start Bluetooth on Edison before you run a project:
```
rfkill unblock bluetooth
killall bluetoothd
hciconfig hci0 up
```

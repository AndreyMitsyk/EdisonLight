# EdisinLight
Lighting control through the Edison board.

##### N.B. Instead of the relay in the projects used the LED. 
	
* In the "master" branch a version of the light control via light sensor and ultrasonic ranger.
Additionally, you need to install
```
npm install microseconds
npm install intel-edison-lcd-rgb-backlight-display-helper
```

* In the "ble" branch a version of the light control via Edison ble (Bluetooth low energy) and some ble device (e.g. mi band).
Additionally, you need to install
```
npm install noble
npm install intel-edison-lcd-rgb-backlight-display-helper
```
and start Bluetooth on Edison before you run a project:
```
rfkill unblock bluetooth
killall bluetoothd
hciconfig hci0 up
```

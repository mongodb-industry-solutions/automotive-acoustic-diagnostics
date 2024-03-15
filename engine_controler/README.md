# Setup

![image](/media/RPi-Rele-Engine-schema.png)

### RaspBerry Pi 5:



```
OS: Ubuntu 23.10 aarch64 
Host: Raspberry Pi 5 Model B Rev 1.0 
Kernel: 6.5.0-1009-raspi Shell: bash 5.2.15 
DE: GNOME 45.2 
WM: Mutter 
WM Theme: Adwaita 
Theme: Yaru [GTK2/3] 
cons: Yaru [GTK2/3] 
Terminal: gnome-terminal 
CPU: BCM2835 (4) @ 2.400GHz 
Memory: 1927MiB / 7943MiB 
```


### Relay:
`KF-301 1 relay 5V module`
Even thought the Relay name is 5V, it has to be connected to a 3.3V pin on the the RPi 5 for the power supply. 

### Engine:
`4-Cylinder Engine DM13 TECHING`


# Pre-requisites 

- `sudo apt install gpiod libgpiod-dev libgpiod-doc libnode-dev`
- `node`
- `npm`
- `express`
- `node-libgpiod`
- `realm`
- `axios`
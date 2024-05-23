from gpiozero import InputDevice, LED
import requests

from time import sleep

# Initialize the sensor as a digital input device on GPIO 4
sensor = InputDevice(4)
sensor_status = True

# Initialize LED pins
red = LED(12)    # Red LED connected to GPIO pin 12
yellow = LED(6) # Yellow LED connected to GPIO pin 6
green = LED(13)  # Green LED connected to GPIO pin 13


while True:
    if sensor.is_active:
        print("No obstacle detected")  # Prints when no obstacle is detected
    else:
        if sensor_status:
            requests.get(url="http://localhost:3000/start")
            sensor_status = False
        else:
            requests.get(url="http://localhost:3000/stop")
            sensor_status = True
        print("Obstacle detected")     # Prints when an obstacle is detected


    with open('engine_status.txt', 'r') as file: #At the time of developing this I could´t find a node.js library to handle these sensors on the RaspberryPi 5. So implemente these cheeky solution where /realm/app.js writes into a file and I handle the logic of the sensors within this python program by reading the txt file
        line = file.readline().strip()
        print(file.readline()) #data is at the first line
        if line == 'Engine Off':
            green.off()  
            yellow.off()  
            red.off()  
        if line == 'Running Normally':
            green.on()  
            yellow.off()  
            red.off()  
        if line == 'Soft Material Hit':
            green.off()  
            yellow.on()  
            red.off()  
        if line == 'Metallic Hit':
            green.off()  
            yellow.off()  
            red.on()  
    sleep(1) 

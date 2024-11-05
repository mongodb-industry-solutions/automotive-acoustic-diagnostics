from gpiozero import InputDevice, LED
from time import sleep

# Initialize the sensor as a digital input device on GPIO 4
sensor = InputDevice(4)
sensor_status = True

# Initialize LED pins
red = LED(12)    # Red LED connected to GPIO pin 12
yellow = LED(6) # Yellow LED connected to GPIO pin 6
green = LED(13)  # Green LED connected to GPIO pin 13
relay = LED(16) # Relay connected to GPIO pin 16

def set_engine_status(status):
    """Control relay based on the engine status."""
    if status == "start":
        relay.off()  # Turn on the engine
    else:
        relay.on()   # Turn off the engine

def check_sensor():
    global sensor_status
    if sensor.is_active:
        print("No obstacle detected")
    else:
        if sensor_status:
            set_engine_status("start")
            sensor_status = False
        else:
            set_engine_status("stop")
            sensor_status = True
        print("Obstacle detected")


def main():

    while True:
        check_sensor()
        sleep(1)

if __name__ == "__main__":
    main()

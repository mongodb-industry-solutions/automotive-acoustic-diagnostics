from gpiozero import InputDevice, LED
from time import sleep
from database import initial_sync, vehicle

# Initialize the sensor as a digital input device on GPIO 4
sensor = InputDevice(4)
is_engine_on = False

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
    global vehicle

    if not vehicle:
        print("Vehicle data not found.")
        return
    elif sensor.is_active:
        print("No obstacle detected")
    else:
        if vehicle.LightsOn:
            print("Turning off")
            set_engine_status("stop")
            vehicle.LightsOn = False
        else:
            print("Turning on")
            set_engine_status("start")
            vehicle.LightsOn = True
        print("Obstacle detected")


def main():
    initial_sync()  # Load vehicle data from MongoDB
    while True:
        check_sensor()
        sleep(1)

if __name__ == "__main__":
    main()

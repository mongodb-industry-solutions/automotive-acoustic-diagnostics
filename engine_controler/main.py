from gpiozero import InputDevice, LED
from time import sleep
import threading
import vehicle

# Initialize the sensor as a digital input device on GPIO 4
sensor = InputDevice(4)
is_engine_on = False

# Initialize LED pins
red = LED(12)    # Red LED connected to GPIO pin 12
yellow = LED(6) # Yellow LED connected to GPIO pin 6
green = LED(13)  # Green LED connected to GPIO pin 13
relay = LED(16) # Relay connected to GPIO pin 16
relay.value = 1

def set_engine_status(status):
    """Control relay based on the engine status."""
    if status == "start":
        relay.off()  # Turn on the engine
    else:
        relay.on()   # Turn off the engine

def check_sensor():
    if not vehicle.data:
        print("Vehicle data not found.")
        return
    elif sensor.is_active:
        print("No obstacle detected")
    else:
        if vehicle.data.LightsOn:
            print("Turning off")
            vehicle.set_lights_on(False)
        else:
            print("Turning on")
            vehicle.set_lights_on(True)
        print("Obstacle detected")


def main():
    vehicle.initial_sync()  # Load vehicle data from MongoDB
    print(vehicle.data.__dict__)

    # Start the change stream in a separate thread
    change_stream_thread = threading.Thread(target=vehicle.monitor_changes)
    change_stream_thread.daemon = True  # Allows the thread to exit when the main program does
    change_stream_thread.start()

    while True:
        check_sensor()

        if vehicle.data and vehicle.data.LightsOn:
            set_engine_status("start")
        else:
            set_engine_status("stop")

        sleep(1)

if __name__ == "__main__":
    main()

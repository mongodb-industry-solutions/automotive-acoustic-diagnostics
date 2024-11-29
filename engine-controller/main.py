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

# Intialize relay
relay = LED(16) # Relay connected to GPIO pin 16
relay.value = 1

def update_relay(turnOn):
    if turnOn:
        relay.off()  # Turn on the engine
    else:
        relay.on()   # Turn off the engine

def update_leds(status):
    if status == 'Running Normally':
        green.on()  
        yellow.off()  
        red.off()  
    elif status == 'Soft Material Hit':
        green.off()  
        yellow.on()  
        red.off()  
    elif status == 'Metallic Hit':
        green.off()  
        yellow.off()  
        red.on()
    else:
        green.off()  
        yellow.off()  
        red.off()

def turn_engine_on():
    print("Turning on")
    vehicle.set_lights_on(True)
    vehicle.set_engine_status("Running Normally")

def turn_engine_off():
    print("Turning off")
    vehicle.set_lights_on(False)
    vehicle.set_engine_status("Engine Off")

def check_sensor():
    if vehicle.data and not sensor.is_active:
        if vehicle.data.LightsOn:
            turn_engine_off()
        else:
            turn_engine_on()

def check_battery():
    if vehicle.data and vehicle.data.Battery_Current <= 0 and vehicle.data.LightsOn:
        turn_engine_off()

def main():
    vehicle.initial_sync()  # Load vehicle data from MongoDB
    vehicle.set_telemetry(100,15) # Initialize telemetry data
    
    print(vehicle.data.__dict__)

    # Start the change stream in a separate thread
    change_stream_thread = threading.Thread(target=vehicle.monitor_changes)
    change_stream_thread.daemon = True  # Allows the thread to exit when the main program does
    change_stream_thread.start()

    # Start the telemetry simulation in a separate thread
    telemetry_thread = threading.Thread(target=vehicle.simulate_telemetry)
    telemetry_thread.daemon = True
    telemetry_thread.start()

    while True:
        check_sensor()
        check_battery()

        if vehicle.data:
            update_relay(vehicle.data.LightsOn)
            update_leds(vehicle.data.Engine_Status)

        sleep(1)

if __name__ == "__main__":
    main()

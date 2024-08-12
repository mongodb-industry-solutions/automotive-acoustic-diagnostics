import os
from dotenv import load_dotenv
import certifi
from pymongo import MongoClient
import time
from datetime import datetime, timezone
from pynput import keyboard
from sample_documents import running_normally_doc, soft_hit_doc

load_dotenv()

connection_string = os.getenv("MONGO_CONNECTION_STRING")

client = MongoClient(connection_string, tlsCAFile=certifi.where())

db = client['acoustic-engine-demo']
mongodb_results_collection = db['results']

special_key_pressed = False
program_running = True

normal_count = 0
hit_count = 0

def on_press(key):
    global special_key_pressed, program_running
    try:
        if key.char == 's':
            special_key_pressed = True
    except AttributeError:
        if key == keyboard.Key.esc or key == keyboard.Key.ctrl: # Stop the program
            program_running = False
            return False

def on_release(key):
    global special_key_pressed
    try:
        if key.char == 's':
            special_key_pressed = False
    except AttributeError:
        pass


listener = keyboard.Listener(on_press=on_press, on_release=on_release, suppress=True)
listener.start()

def insert_document_periodically():
    global special_key_pressed, program_running, normal_count, hit_count

    print("Press 's' to simulate a special hit. Press 'esc' to stop the program.")

    while program_running:
        if special_key_pressed:
            document = soft_hit_doc.copy()
            document["data_time"] = datetime.now(timezone.utc)
            hit_count += 1
        else:
            document = running_normally_doc.copy()
            document["data_time"] = datetime.now(timezone.utc)
            normal_count += 1

        mongodb_results_collection.insert_one(document)
        print(f"\rNormal: {normal_count} | Special: {hit_count}", end='')

        time.sleep(1)
    
    listener.stop()
    print("\nProgram terminated.")

# Start inserting documents
insert_document_periodically()
import os
import paho.mqtt.client as mqtt
import time
from math import cos, sin, pi, floor
from adafruit_rplidar import RPLidar

# Setup the RPLidar
PORT_NAME = '/dev/ttyUSB0'
lidar = RPLidar(None, PORT_NAME)

# used to scale data to fit on the screen
max_distance = 0

scan_data = [0]*360
info = lidar.info
health = lidar.health

# setup mqtt connection
client = mqtt.Client()
client.connect('192.168.168.162', 1883)
client.loop_start()
client.subscribe('rplidar1_sub', 2)

def on_message(client, userdata, msg):
    client.publish('device_info', '["rplidar_1","'+str(info['model'])+'","'+str(info['firmware'])+'","'+str(info['hardware'])+'","'+info['serialnumber']+'","'+health[0]+'"]')

client.on_message = on_message

def process_data(data):
    client.publish('rplidar_1', '['+','.join(str(e) for e in data)+']')
    pass

try:
    for scan in lidar.iter_scans():
        for (_, angle, distance) in scan:
            scan_data[min([359, floor(angle)])] = distance
        process_data(scan_data)
except KeyboardInterrupt:
    print('Stoping.')

lidar.stop()
lidar.stop_motor()
lidar.disconnect()

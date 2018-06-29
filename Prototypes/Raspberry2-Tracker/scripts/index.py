###### PARCELKEY TRACKER ######
#!/usr/bin/python
from multiprocessing import Process

# ePaper
import epd2in7
from PIL import Image, ImageFont, ImageDraw

def displayInit():
    print("Init Display")
    epd = epd2in7.EPD()
    epd.init()

    # For simplicity, the arguments are explicit numerical coordinates
    print(epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT)
    image = Image.new('1', (epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT), 255)    # 255: clear the image with white
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype('/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf', 18)
    draw.text((20, 50), 'e-Paper demo', font = font, fill = 0)
    draw.rectangle((0, 76, 176, 96), fill = 0)
    draw.text((18, 80), 'Hello world!', font = font, fill = 255)
    draw.line((10, 130, 10, 180), fill = 0)
    draw.line((10, 130, 50, 130), fill = 0)
    draw.line((50, 130, 50, 180), fill = 0)
    draw.line((10, 180, 50, 180), fill = 0)
    draw.line((10, 130, 50, 180), fill = 0)
    draw.line((50, 130, 10, 180), fill = 0)
    draw.arc((90, 190, 150, 250), 0, 360, fill = 0)
    draw.chord((90, 120, 150, 180), 0, 360, fill = 0)
    draw.rectangle((10, 200, 50, 250), fill = 0)

    epd.display_frame(epd.get_frame_buffer(image))

    # display images
    epd.display_frame(epd.get_frame_buffer(Image.open('ParcelKey.bmp')))

def parcelkey():
    print("Init Display")

    image = Image.new('1', (epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT), 255)


#####################
# RFID

import RPi.GPIO as GPIO
import SimpleMFRC522

def scanRFID():
    print("RFID READING")
    reader = SimpleMFRC522.SimpleMFRC522()

    while True:
        id, text = reader.read()
        print(id)
        print(text)
        # finally:
            # GPIO.cleanup()
            # scanRFID()


# try:
#         id, text = reader.read()
#         print(id)
#         print(text)
# finally:
#         GPIO.cleanup()

#####################
# SOCKET CLIENT

import json
import websocket

url = "ws://172.20.10.3:3001/"

import threading

import time

def emit(ws, channel, data):
    data = {"channel": channel, "data": data}    
    json_string = json.dumps(data)
    ws.send(json_string)

def on(channel, data, callback):
    data = json.loads(data)
    if data['channel'] == channel:
        data = str(data['data'])
        callback(data)

# Callbacks
def on_testchannel(data):
    print(data)

def on_toParcelKeyTracker(data):
    print(data)

# Events
def on_message(ws, data):
    # print('msg',data)
    displayInit()
    on("testchannel", data, on_testchannel)
    on("toParcelKeyTracker", data, on_toParcelKeyTracker)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    displayInit()
    def run(*args):
        print("### open ###")
        emit(ws, "testchannel", "Hello From ParcelKeyTracker")
        emit(ws, "toParcelKey", "Hello From ParcelKeyTracker")
    
    wsThread = threading.Thread(name="websocket", target=run)
    wsThread.start()
    print('ThreadCompleted')

    rfidThread = threading.Thread(name="rfid", target=scanRFID)
    rfidThread.start()



if __name__ == "__main__":
    # p2 = Process(target=scanRFID)
    # p2.start()
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(url,
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()

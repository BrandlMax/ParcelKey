###### PARCELKEY TRACKER ######

#!/usr/bin/python
from multiprocessing import Process

url = None
testurl = None

# Load Config
import json

with open('_CONFIG.json') as configFile:
    config = json.load(configFile)

    url = config["serverIpAdress"]
    testurl = config["serverIpAdress"]

# Check Connection (for reboot auto start)
# https://stackoverflow.com/questions/10609358/python-wait-until-connection-active
import urllib2


def wait_for_internet_connection():
    while True:
        try:
            ping = 'http://' + testurl + ':3000/'
            print(ping)
            response = urllib2.urlopen(ping, timeout=1)
            print(response)
            return
        except urllib2.URLError:
            print("Conection Failed")
            pass



# ePaper
import epd2in7
from PIL import Image, ImageFont, ImageDraw


def displayInit():
    print("Init Display")
    epd = epd2in7.EPD()
    epd.init()

    # For simplicity, the arguments are explicit numerical coordinates
    print(epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT)
    # 255: clear the image with white
    # image = Image.new('1', (epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT), 255)
    # draw = ImageDraw.Draw(image)
    # font = ImageFont.truetype(
    #     '/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf', 18)
    # draw.text((20, 106), 'Max Mustermann', font=font, fill=0)
    # draw.text((44, 106), 'Musterstrasse 23', font=font, fill=0)
    # draw.text((68, 88), '12345 Musterstadt', font=font, fill=0)
    # draw.line((105, 265, 105, 0), fill=0)
    # draw.line((104, 66, 0, 66), fill=0)
    # draw.text((20, 50), 'e-Paper demo', font=font, fill=0)
    # draw.rectangle((0, 76, 176, 96), fill=0)
    # draw.text((18, 80), 'Hello world!', font=font, fill=255)
    # draw.line((10, 130, 10, 180), fill=0)
    # draw.line((10, 130, 50, 130), fill=0)
    # draw.line((50, 130, 50, 180), fill=0)
    # draw.line((10, 180, 50, 180), fill=0)
    # draw.line((10, 130, 50, 180), fill=0)
    # draw.line((50, 130, 10, 180), fill=0)
    # draw.arc((90, 190, 150, 250), 0, 360, fill=0)
    # draw.chord((90, 120, 150, 180), 0, 360, fill=0)
    # draw.rectangle((10, 200, 50, 250), fill=0)

    # epd.display_frame(epd.get_frame_buffer(image))

    # display images
    epd.display_frame(epd.get_frame_buffer(Image.open('img/ParcelKey.bmp')))


def parcelkey():
    print("Init Annahme")
    epd = epd2in7.EPD()
    epd.init()

    # image = Image.new('1', (epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT), 255)
    epd.display_frame(epd.get_frame_buffer(
        Image.open('img/paketangenommen.bmp')))

    epd.display_frame(epd.get_frame_buffer(Image.open('img/ParcelKey.bmp')))


def parcelCat():
    print("Init ParcelCat")
    epd = epd2in7.EPD()
    epd.init()

    # image = Image.new('1', (epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT), 255)
    epd.display_frame(epd.get_frame_buffer(Image.open('img/cat.bmp')))
    epd.display_frame(epd.get_frame_buffer(Image.open('img/Cat2.bmp')))

    epd.display_frame(epd.get_frame_buffer(Image.open('img/ParcelKey.bmp')))

def kontaktUpdate():
    print("Init KontaktUpdate")
    epd = epd2in7.EPD()
    epd.init()

    # image = Image.new('1', (epd2in7.EPD_WIDTH, epd2in7.EPD_HEIGHT), 255)
    epd.display_frame(epd.get_frame_buffer(
        Image.open('img/acceptedContact.bmp')))

    # epd.display_frame(epd.get_frame_buffer(Image.open('img/ParcelKey.bmp')))

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
        # print(text)
        if id == 462807405895:
            # CatCard
            emit(wsGlobal, "testchannel", "Paketannahme!Cat")
            emit(wsGlobal, "toParcelKey", "Paketannahme!Cat")
            parcelCat()
            scanRFID()
        elif id == 645895521064:
            # ParcelKey
            emit(wsGlobal, "testchannel", "Paketannahme!")
            emit(wsGlobal, "toParcelKey", "Paketannahme!")
            parcelkey()
            scanRFID()
        else:
            # Fallback any RFID
            emit(wsGlobal, "testchannel", "Paketannahme!")
            emit(wsGlobal, "toParcelKey", "Paketannahme!")
            parcelkey()
            scanRFID()

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
import websocket

url = "ws://" + url + ":3001/"

print(url)

import threading

import time


def emit(ws, channel, data):
    global wsGlobal
    wsGlobal = ws
    print(wsGlobal)
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
    # print(on_toParcelKeyTracker)



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
    wait_for_internet_connection()
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(url,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()


# STOP ON CTRL + C
# https://stackoverflow.com/questions/22432397/how-to-stop-a-script-totally-with-keyboard-interrupt
import signal
import sys


def signal_handler(signal, frame):
    exit(0)


signal.signal(signal.SIGINT, signal_handler)
# sleep until a signal is received
# signal.pause()

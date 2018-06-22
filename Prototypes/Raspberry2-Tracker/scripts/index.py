###### PARCELKEY TRACKER ######
#!/usr/bin/python
import json
import websocket

url = "ws://192.168.0.150:3001/"

try:
    import thread
except ImportError:
    import _thread as thread
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
    print('msg',data)
    on("testchannel", data, on_testchannel)
    on("toParcelKeyTracker", data, on_toParcelKeyTracker)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    def run(*args):
        print("### open ###")
        emit(ws, "testchannel", "Hello From ParcelKeyTracker")
        emit(ws, "toParcelKey", "Hello From ParcelKeyTracker")
    
    thread.start_new_thread(run, ())


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(url,
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()

#####################

# RFID

# ePaper
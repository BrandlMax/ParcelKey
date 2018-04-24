import serial
ser = serial.Serial('/dev/ttyUSB0', 2400) 
print('listen..')
while True:
    try:
        print(ser)
        response = ser.read(100)
        print(response)
    except KeyboardInterrupt:
        break

ser.close()
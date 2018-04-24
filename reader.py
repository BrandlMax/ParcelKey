import serial
ser = serial.Serial('/dev/ttyUSB0', 9600) # here you have to write your port. If you dont know how to find it just write ls -l /dev/tty.* in your terminal (i'm using mac)

while True:
    try:
        response = ser.readline()
        print response
    except KeyboardInterrupt:
        break

ser.close()

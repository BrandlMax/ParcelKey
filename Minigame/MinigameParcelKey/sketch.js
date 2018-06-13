const maxSpeed = 1;
let carOffset = 170;
let traficLight = false;
let traficLightPosition = 380;

class Car {
    constructor(posX) {
        this.posX = posX;
        this.v = 0;
        this.a = 0.05;
        this.passedTraficLight = false;
    }

    draw() {
        if (this.image) {
            image(this.image, this.posX, this.posY);
        }
    }

    drive(offset) {
        this.v += this.a;
        if(this.v > maxSpeed) {
            this.v = maxSpeed;
        }
        this.posX += this.v;
        const offsetBorder = traficLightPosition - offset * 90;
        if (this.posX > offsetBorder && !traficLight && !this.passedTraficLight) {
            this.posX = offsetBorder;
        } else if (this.posX > traficLightPosition && traficLight && !this.passedTraficLight) {
            this.passedTraficLight = true;
        }
        this.draw();
    }
}

class Postcar extends Car {
    constructor(posX) {
        super(posX);
        this.posY = carOffset;
        loadImage('img/postcar.png', (img) => {
            this.image = img
        });
    }
}

class Normalcar extends Car {
    constructor(posX) {
        super(posX);
        this.posY = carOffset + 8;
        loadImage('img/autochen.png', (img) => {
            this.image = img
        });
    }
}

const cars = [];
let backgroundImage = null;

function setup() {
    createCanvas(805,300);
    cars.push(new Postcar(20));
    addCar();
    addCar();
    addCar();
    loadImage('img/hintergrund.jpg', (img) => {
        backgroundImage = img;
    });
}

function draw() {
    if (backgroundImage) {
        background(255);
        image(backgroundImage, 0,30);
    }
    let i = 1;
    cars.forEach((car) => {
       car.drive(cars.length - i++);
    });
}

function addCar() {
    cars.push(new Normalcar(cars.length * 80 + 40));
}
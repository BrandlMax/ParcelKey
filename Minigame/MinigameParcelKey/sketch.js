const maxSpeed = 0.3;
let carOffset = 170;
let traficLight = true;
let traficLightPosition = 455;
let draggingCar = false;
let dragCarX = 260;
let dragCarY = 40;
let dragOffsetX = 0;
let dragOffsetY = 0;
let delivered = false;

let postcarImage = null;
let carImage = null;

class Car {
  constructor(posX) {
    this.posX = posX;
    this.v = 0;
    this.a = 0.01;
    this.passedTraficLight = false;
    this.width = 0;
    this.image = null;
    this.posY = 0;
  }

  draw() {
    if (this.image) {
      image(this.image, this.posX, this.posY);
    }
  }

  drive(offset) {
    this.v += this.a;
    if (this.v > maxSpeed) {
      this.v = maxSpeed;
    }
    this.posX += this.v;
    const offsetBorder = traficLightPosition - offset * 90 - this.width - 10;
    if (this.posX > offsetBorder && !traficLight && !this.passedTraficLight) {
      this.posX -= this.v;
    } else if (this.posX > traficLightPosition && traficLight && !this.passedTraficLight) {
      this.passedTraficLight = true;
    }
    this.draw();
  }

  collides(x, w) {
    return !(x + w < this.posX || x > this.posX + this.width);
  }
}

class Postcar extends Car {
  constructor(posX) {
    super(posX);
    this.posY = carOffset;
    this.image = postcarImage;
    this.width = 81;
  }

  draw(offset) {
    super.draw(offset);
    if (this.posX > 800) {
      delivered = true;
    }
    if (this.posX > 850) {
      restart();
    }
  }

  getPosX() {
    return this.posX;
  }
}

class Normalcar extends Car {
  constructor(posX) {
    super(posX);
    this.posY = carOffset + 8;
    this.image = carImage;
    this.width = 55;
  }
}

let cars = [];
let backgroundImage = null;
let backgroundImageGreen = null;
let parcelImage = null;

let loading = 5;

function imageLoaded() {
  if (!(--loading)) {
    cars.push(new Postcar(20));
  }
}

function remainingtime() {
  if (cars.length > 0) {
    return Math.floor((10 + (cars.length - 1) * 2 + (traficLight ? 0 : 5)) * (805 - cars[0].getPosX()) / 805);
  }
  return 0;
}

function setup() {
  createCanvas(900, 500);
  loadImage('img/hintergrund.jpg', (img) => {
    backgroundImage = img;
    imageLoaded();
  });
  loadImage('img/hintergrundgreen.jpg', (img) => {
    backgroundImageGreen = img;
    imageLoaded();
  });
  loadImage('img/postcar.png', (img) => {
    postcarImage = img;
    imageLoaded();
  });
  loadImage('img/autochen.png', (img) => {
    carImage = img;
    imageLoaded();
  });
  loadImage('img/ParcelKey.png', (img) => {
    parcelImage = img;
    imageLoaded();
  });
}

function draw() {
  if (backgroundImage && backgroundImageGreen) {
    background(255);
    if (traficLight) {
      image(backgroundImageGreen, 0, 30);
    } else {
      image(backgroundImage, 0, 30);
    }
  }
  if (carImage) {
    if (!inDraggableArea()) {
      tint(255, 127);
    } else {
      tint(255, 200);
    }
    let carX = dragCarX;
    let carY = dragCarY;
    if (draggingCar) {
      carX = mouseX - dragOffsetX;
      carY = mouseY - dragOffsetY;
    }
    image(carImage, carX, carY);
    noTint();
  }
  let i = 1;
  cars.forEach((car) => {
    car.drive(cars.length - i++);
  });
  if (parcelImage) {
    image(parcelImage, 520, 190);
    if (!delivered) {
      fill(231);
      noStroke();
      rect(647.5, 225, 100, 100);
      textAlign(CENTER);
      fill(0);
      textSize(50);
      text(remainingtime(), 697.5, 290);
    }
  }
}

function addCar(x) {
  let collides = false;
  cars.forEach((car) => {
    if (car.collides(x - 10, 65)) {
      collides = true;
    }
  });
  if (!collides) {
    cars.push(new Normalcar(x));
  }
}

function mousePressed() {
  if (mouseX > traficLightPosition - 25 && mouseX < traficLightPosition + 25 &&
    mouseY > 100 && mouseY < 200) {
    traficLight = !traficLight;
  }
  if (mouseX > dragCarX && mouseX < dragCarX + 55 && mouseY > dragCarY && mouseY < dragCarY + 30) {
    draggingCar = true;
    dragOffsetX = mouseX - dragCarX;
    dragOffsetY = mouseY - dragCarY;
  }
}

function inDraggableArea() {
  return draggingCar && cars.length > 0 && mouseX > cars[0].getPosX() + 90 && mouseY > 160 && mouseY < 210;
}

function mouseReleased() {
  if (inDraggableArea()) {
    addCar(mouseX - dragOffsetX);
  }
  draggingCar = false;
  dragOffsetX = 0;
  dragOffsetY = 0;
}

function restart() {
  cars = [];
  cars.push(new Postcar(-88));
  delivered = false;
}

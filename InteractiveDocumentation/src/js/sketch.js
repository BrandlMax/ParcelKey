const maxSpeed = 0.3;
var carOffset = 170;
var traficLight = true;
var traficLightPosition = 455;
var draggingCar = false;
var dragCarX = 260;
var dragCarY = 40;
var dragOffsetX = 0;
var dragOffsetY = 0;
var delivered = false;

var postcarImage = null;
var carImage = null;

class Car {
  constructor(posX) {
    this.posX = posX;
    this.v = 0;
    this.a = 0.01;
    this.passedTraficLight = false;
    this.width = 0;
    this.image = null;
    this.posY = 0;
    this.stands = false;
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
    this.stands = false;

    const offsetBorder = traficLightPosition - offset * 90 - this.width - 10;
    if (this.posX > offsetBorder && !traficLight && !this.passedTraficLight) {
      this.posX -= this.v;
      this.stands = true;
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

var cars = [];
var backgroundImage = null;
var backgroundImageGreen = null;
var parcelImage = null;

var loading = 5;

function imageLoaded() {
  if (!(--loading)) {
    cars.push(new Postcar(20));
  }
}

var timeRemaining = 0;

function remainingtime() {
  if (cars.length > 0) {
    // this.stands = true;
    if (cars[0].stands === false) {
      timeRemaining = Math.floor((10 * (900 - cars[0].getPosX()) / 900));
    }
  }
}

function setup() {
  var canvas = createCanvas(900, 400);
  canvas.parent('minigame');

  loadImage('/src/img/hintergrund.jpg', (img) => {
    backgroundImage = img;
    imageLoaded();
  });
  loadImage('/src/img/hintergrundgreen.jpg', (img) => {
    backgroundImageGreen = img;
    imageLoaded();
  });
  loadImage('/src/img/postcar.png', (img) => {
    postcarImage = img;
    imageLoaded();
  });
  loadImage('/src/img/autochen.png', (img) => {
    carImage = img;
    imageLoaded();
  });
  loadImage('/src/img/ParcelKey.png', (img) => {
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
    var carX = dragCarX;
    var carY = dragCarY;
    if (draggingCar) {
      carX = mouseX - dragOffsetX;
      carY = mouseY - dragOffsetY;
    }
    image(carImage, carX, carY);
    noTint();
  }

  var i = 1;
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
      remainingtime();
      text(timeRemaining, 697.5, 290);
    }
  }
}

function getFrontCarX() {
    return cars.reduce((acc, car) => {
      if (car.posX > acc) {
        acc = car.posX;
      }
      return acc;
    }, 0);
}

function addCar(x) {
  var collides = false;

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
  var frontCarX = getFrontCarX();
  return draggingCar && cars.length > 0 && mouseX > cars[0].getPosX() + 90 && mouseY > 160 && mouseY < 210 && mouseX > frontCarX;
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

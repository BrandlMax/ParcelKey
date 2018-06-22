let angle = 0;

function setup() {
  createCanvas (400,400);
  angleMode(DEGREES);

}



function draw() {

    background(0);
    translate(200,200)
    rotate(angle)
    fill(255);
    rectMode(CENTER);
    rect(0,0,100,50)

    angle = angle + 1;



}
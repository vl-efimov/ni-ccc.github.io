
let t = 0;



class Agent {
  constructor() {
    const SR = 0.5 //SPEED_RANGE
    this.pos = createVector(random(0, width), random(0, height));
    this.vel = createVector(random(-SR, SR), random(-SR, SR));
    this.acc = createVector(0, 0);
  }

  draw() {

    //const color = colorMin.copy();
    //color.lerp(colorMax, this.countAround / 10);
    //fill(color.x, color.y, color.z);
    fill(0, 255);
    circle(this.pos.x, this.pos.y, 5);
    //stroke(120, 120, 120);
    //circle(this.pos.x, this.pos.y, this.rad * 2);
  }

  update(agents) {
    const heading = noise(this.pos.x / 100, this.pos.y / 100, t);
    const vec = createVector(0, 1);
    vec.rotate(heading * PI);
    this.acc = vec
    this.acc.setMag(0.2);


    //this.acc.limit(0.1);
    this.vel.add(this.acc);
    this.vel.setMag(2);
    this.pos.add(this.vel);

    //wraping
    if (this.pos.x > width)
      this.pos.x = 0;

    else if(this.pos.x < 0)
      this.pos.x = width;

    if (this.pos.y > height)
      this.pos.y = 0;
    else if (this.pos.y < 0)
      this.pos.y = height;
  }
}

const agents = [];

function setup() {
  createCanvas(800, 400);
  for(let i = 0; i < 200; ++i)
    agents.push(new Agent());
  //noFill();
  fill(0);
  background(255);
}

function draw() {
  background(255);
  for(let i = 0; i < agents.length; ++i) {
    agents[i].update(agents);
    agents[i].draw();
  }

  stroke(0, 50);
  for (let i = 0; i < width; i += 10){
    for (let j = 0; j < height; j += 10) {
      const heading = noise(i / 100, j / 100, t);
      const vec = createVector(0, 1);
      vec.rotate(heading * PI);
      line(i, j, i + vec.x * 10, j + vec.y * 10);
    }
  }

  t += 0.01;
}

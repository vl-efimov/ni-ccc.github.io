



class Agent {
  constructor() {
    const SR = 0.5 //SPEED_RANGE
    const AR = 0.5 //ACCELERATION_RANGE
    this.pos = createVector(random(0, width), random(0, height));
    this.vel = createVector(random(-SR, SR), random(-SR, SR));
    this.acc = createVector(0, 0);
    this.rad = 20;
    this.countAround = 0;
  }

  draw() {

    //const color = colorMin.copy();
    //color.lerp(colorMax, this.countAround / 10);
    //fill(color.x, color.y, color.z);
    circle(this.pos.x, this.pos.y, 1);
    //stroke(120, 120, 120);
    //circle(this.pos.x, this.pos.y, this.rad * 2);
  }

  update(agents) {
    const aroundMe = agents.filter((otherAgent) => { 
      return otherAgent.pos.dist(this.pos) < this.rad 
    });
    this.countAround = aroundMe.length;
    
    //cohesion
    const avgPos = aroundMe.reduce((avgPos, otherAgent) => { 
      avgPos.add(otherAgent.pos);
      return avgPos; 
    }, createVector(0, 0));
    avgPos.div(aroundMe.length);
    const cohDir = avgPos.sub(this.pos);

    //sparation
    const tmp = createVector(0, 0);
    const sepDir = aroundMe.reduce((acm, otherAgent) => { 
      tmp.set(this.pos.x, this.pos.y);
      tmp.sub(otherAgent.pos).normalize();
      acm.add(tmp);
      return acm; 
    }, createVector(0, 0));
    sepDir.mult(4);


    //alignment
    const alignDir = aroundMe.reduce((acm, otherAgent) => { 
      acm.add(otherAgent.vel);
      return acm; 
    }, createVector(0, 0));
    alignDir.div(aroundMe.length);
    alignDir.normalize();
    const velCopy = this.vel.copy();
    velCopy.normalize();
    alignDir.sub(velCopy);
    
    

    //accumulate forces
    this.acc.add(cohDir);
    this.acc.add(sepDir);
    this.acc.add(alignDir);


    //
    this.acc.limit(0.1);
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);

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
  background(255, 20);
  for(let i = 0; i < agents.length; ++i) {
    agents[i].update(agents);
    agents[i].draw();
  }
}

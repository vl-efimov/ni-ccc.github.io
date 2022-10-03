import { STAR_SIZE } from './config.js'

export class Star {

    constructor (p, phi, theta, luminosity, starfield) {

      this.p = p
      this.phi = phi;
      this.theta = theta;
      this.luminosity = luminosity;
      this.starfield = starfield;

    }
    
    getNormalizedCoordinates() {
      const r = Math.sin(this.phi)/(1-Math.cos(this.phi));
      const x = r * Math.cos(this.theta + this.starfield.rotation);
      const y = r * Math.sin(this.theta + this.starfield.rotation);
      return this.p.createVector(x, y);
    }
    
    getCoordinates() {
      return this.getNormalizedCoordinates().mult(this.starfield.radius_full);
    }
    
    show() {
      this.p.noStroke();
      this.p.fill(0, 0, 100, this.luminosity);
      const position = this.getCoordinates();
      this.p.circle(position.x, position.y, STAR_SIZE);
    }
    
    isOccupiedByClock() {
      return (this.starfield.clock.handSeconds.stars.includes(this) || 
              this.starfield.clock.handMinutes.stars.includes(this) || 
              this.starfield.clock.handHours.stars.includes(this));
    }
  }
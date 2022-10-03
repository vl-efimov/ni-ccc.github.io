import { HANDS_POINTS_DENSITY } from './config.js'

class ClockHand {
    
    constructor(p, starfield, handLength, col) {
        
        this.p = p
        this.starfield = starfield
        this.handLength = handLength
        this.col = col
        this.update()
    }
    
    update() {
        this.updateRotation()
        this.updatePoints()
    }
    
    updateRotation() {  
        this.angle = this.timeFunction() * 6
    }
    
    updatePoints() {
        this.stars = []
        for (
            let y = HANDS_POINTS_DENSITY;
            y < this.starfield.radius * this.handLength; 
            y += HANDS_POINTS_DENSITY
        ) {
            let point = this.p.createVector(0, -y).rotate(this.p.radians(this.angle))
            let closestStar = this.starfield.foreground[0]
            let closestDistance = point.dist(closestStar.getCoordinates())
            for (let i = 1; i < this.starfield.foreground.length; i++) {
                let currentStar = this.starfield.foreground[i]
                
                let currentDistance = point.dist(currentStar.getCoordinates())
                if (currentDistance < closestDistance){
                    closestStar = currentStar
                    closestDistance = currentDistance
                }
            }
            this.stars.push(closestStar)
        }
    }
    
    show() {
        this.p.stroke(this.col, 0, 100, .5)
        this.p.strokeWeight(2)
        this.p.beginShape()
        this.stars.forEach((star) => {
            this.p.vertex(star.getCoordinates().x, star.getCoordinates().y)
        }) 
        this.p.endShape()
    }
   
  }
  
  // separate ClockHand types
  
export class ClockHandSeconds extends ClockHand {
    timeFunction() { 
        const today = new Date()
        return today.getSeconds()
    }
    constructor(p, starfield) { super(p, starfield, .9, 200); }
}
  
export class ClockHandMinutes extends ClockHand {
    timeFunction() { 
        const today = new Date()
        return today.getMinutes()
    }
    constructor(p, starfield) { super(p, starfield, .6, 230); }
}
  
export class ClockHandHours extends ClockHand {
    timeFunction() { 
        const today = new Date()
        return today.getHours() / 12 * 60
    }
    constructor(p, starfield) { super(p, starfield, .3, 260); }
}
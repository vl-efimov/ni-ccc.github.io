import { Clock } from "./clock.js"
import { Star } from "./star.js"
import { 
    CONSTELLATION_COUNT, 
    CONSTELLATION_MIN_STAR_COUNT, 
    CONSTELLATION_MAX_STAR_COUNT, 
    UPDATE_STARS_PER_FRAME_COUNT,
    STAR_COUNT
} from "./config.js"
import { Constellation } from './constellation.js'

export class Starfield {

    constructor(p) {

        this.p = p
        this.time = this.p.millis()
        this.rotation = 0.0
        this.stars = []
        this.foreground = []
        this.occupiedByConstellations = []
        this.constellations = []
        this.clock = new Clock(p, this)
        this.radius = Math.min(p.width, p.height)/2
        this.radius_full = Math.sqrt(Math.pow(p.width/2, 2) + Math.pow(p.height/2, 2))
        this.foreground_border = this.radius/this.radius_full
        
        this.generateNewStarfield()
        this.generateNewConstellations()

    }

    generateNewStar() {

        const u = Math.random(1);
        const v = Math.random(0.5);
        const phi = Math.acos(2*v-1);
        const r = Math.sin(phi)/(1-Math.cos(phi));
        const theta = 3.1415 * 2 * u;
        const luminosity = Math.random(1);
        const star = new Star(this.p, phi, theta, luminosity, this);
        
        if (r < this.foreground_border) {
            this.foreground.push(star);
        }

        this.stars.push(star);
        return star; 

    }

    generateNewStarfield() {

        for (let i = 0; i < STAR_COUNT; i++) 
            this.generateNewStar()

    }

    generateNewConstellations() {
        
        for (let i = 0; i < CONSTELLATION_COUNT; i++) {
            this.constellations.push(
                new Constellation(
                    this.p,
                    this, 
                    Math.floor(Math.random(CONSTELLATION_MIN_STAR_COUNT, CONSTELLATION_MAX_STAR_COUNT))
                )
            )
        }

    }

    updateStars () {

        let updatedStarsCount = 0;
        while (updatedStarsCount < UPDATE_STARS_PER_FRAME_COUNT) {

            for (let i = 0; i < this.stars.length; i++) {

                let star = this.stars[i]
                if (this.occupiedByConstellations.includes(star) || 
                    star.isOccupiedByClock())
                    continue

                //this.stars.remove(star)
                this.stars.filter(item => item !== star)
                this.generateNewStar()
                updatedStarsCount += 1
                break
                
            }
        }

    }

    updateConstellations() {

        if (Math.random(30) < 1) {

            //this.constellations.remove(0)
            this.constellations.shift()
            this.constellations.push(
                new Constellation(
                    this.p,
                    this, 
                    Math.floor(Math.random(CONSTELLATION_MIN_STAR_COUNT, CONSTELLATION_MAX_STAR_COUNT))
                )
            )
        } 

    }

    update() {
        
        const currentTime = this.p.millis()
        const delta = currentTime - this.time

        //console.log(delta)
        this.clock.update();
        this.updateStars();
        this.updateConstellations();
        this.rotation-=0.001*delta/25

        this.time = currentTime

    }
      
    show () {

        this.constellations.forEach(constellation => constellation.show())
 
        this.clock.show()

        this.stars.forEach(star => star.show())

    }

}
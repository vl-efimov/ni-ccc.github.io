import {
    ClockHandSeconds,
    ClockHandMinutes,
    ClockHandHours
} from './clock_hand.js'

export class Clock {

    constructor (p, starfield) {
      this.starfield = starfield;
      this.handSeconds = new ClockHandSeconds(p, starfield);
      this.handMinutes = new ClockHandMinutes(p, starfield);
      this.handHours = new ClockHandHours(p, starfield);
    }
    
    update() {
        this.handSeconds.update();
        this.handMinutes.update();
        this.handHours.update();
    }
    
    show() {
        this.handSeconds.show();
        this.handMinutes.show();
        this.handHours.show();
    }
  }
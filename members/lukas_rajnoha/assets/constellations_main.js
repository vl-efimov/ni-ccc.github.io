import './config.js' 
import { Starfield } from './starfield.js'

let canvas = null
let s = null

const constellations = (p) => {
	p.setup = () => {
		const w = document.getElementById('constellations-container').clientWidth
		const h = document.getElementById('constellations-container').clientHeight
		console.log(w, h)
		canvas = p.createCanvas(w, h);
		p.colorMode(p.HSB, 360, 100, 100, 1);
		p.noFill();
		p.frameRate(60);
		s = new Starfield(p);
	}

	p.draw = () => {
		p.fill(0, .2);
		p.noStroke();
		p.rect(0, 0, p.width, p.height);
		p.noFill();
		p.translate(p.width/2, p.height/2);

		s.update();
		s.show();
		
		p.stroke(255, 100, 100);
		p.strokeWeight(2);
		p.noFill();
	}
}
new p5(constellations, 'constellations-container')

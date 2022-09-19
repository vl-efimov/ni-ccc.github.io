let sketch = function(p) {
    function Particle(x, y) {
        var direction = p.createVector(0, 0);
        var velocity = p.createVector(0, 0);
        var position = p.createVector(x, y);
        var speed = 0.3;
        var radius = 2;
      
        this.move = function() {
            var noiseScale = 600;
        
            var min = Infinity;
            for (var i = 0; i < 2 * p.PI; i += p.PI / 16) {
                var ox = p.sin(i);
                var oy = p.cos(i);
                var val = p.noise((position.x + ox) / noiseScale, (position.y + oy) / noiseScale);
                if (val < min) {
                min = val;
                direction = p.createVector(-oy, ox).normalize();
                }
            }
            velocity = direction.copy();
            velocity.mult(speed);
            position.add(velocity);
        }
      
        this.touchedEdge = function() {
            if (position.x > p.width || position.x < 0 || position.y > p.height || position.y < 0) {
                position.x = p.random(p.width);
                position.y = p.random(p.height);
            }
        }
      
        this.display = function() {
            p.ellipse(position.x, position.y, radius, radius);
        }
    }

    var total = 300;
    var allparticles_0 = [];
    var allparticles_1 = [];
    let bcolor;
    let p0color;
    let p1color;

    p.setup = function() {
        p.disableFriendlyErrors = true;
        p.createCanvas(p.windowWidth, p.windowHeight);

        bcolor = p.color(255);
        p0color = p.color('#2ecc71ff');
        p1color = p.color('#f1c40fff');

        p.background(bcolor);

        for (var i = 0; i < total; i++) {
            allparticles_0[i] = new Particle(p.random(0, p.width), p.random(0, p.height));
            allparticles_1[i] = new Particle(p.random(0, p.width), p.random(0, p.height));
        }

        p.noStroke();
        // smooth();
        p.noSmooth();
    }

    p.draw = function() {  
        for (var i = 0; i < total; i++) {
            p.fill(p0color);
            allparticles_0[i].move();
            allparticles_0[i].display();
            allparticles_0[i].touchedEdge();

            p.fill(p1color);
            allparticles_1[i].move();
            allparticles_1[i].display();
            allparticles_1[i].touchedEdge()
        }
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
}

new p5(sketch, 'container');
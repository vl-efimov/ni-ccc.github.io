class Edge {
	
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}  

}

export class Constellation {

    constructor(p, starfield, size) {

        this.p = p
        this.starfield = starfield
        this.size = size
        this.stars = []
        this.edges = []

        this.init()

    }

    init() {

        while (this.stars.length < this.size) {

            if (this.stars.length == 0) {

                let c = true

                this.starfield.stars.forEach((star) => {
                    if (c && !this.starfield.occupiedByConstellations.includes(star)) {
                        this.stars.push(star);
                        this.starfield.occupiedByConstellations.add(star);
                        c = false
                    }
                })

                continue

            }

            let wasStarSelected = false
            shuffle(this.stars)

            this.stars.forEach((selectedStar) => {
                let newStar = null

                let skip = false
                this.starfield.stars((star) => {

                    if (!skip &&
                        !starfield.occupiedByConstellations.includes(star)) {

                            let e = new Edge(selectedStar, star)
                            let collisionWithAnotherConstellation = false

                            let c = true
                            this.starfield.constelliatons.forEach((constellation) => {

                                if (c && constellation != this && 
                                    constellation.intersects(e)) {
                                    c = false
                                    collisionWithAnotherConstellation = true
                                }       

                            })

                            if (!collisionWithAnotherConstellation &&
                                !this.intersects(e) &&
                                !(PVector.dist(selectedStar.getCoordinates(), star.getCoordinates()) > CONSTELLATION_MAX_STAR_DISTANCE) &&
                                !(PVector.dist(selectedStar.getCoordinates(), star.getCoordinates()) < CONSTELLATION_MIN_STAR_DISTANCE)) {
                                    newStar = star
                                    skip = true
                            }

                    }

                })

            })

        }

    }

    intersects(e) {

        this.edges.forEach(edge => {
            if (edge_intersect(edge, e)) return true;
        })

        return false

    }

    show() {

        this.p.stroke(1, 0, 100, .2);
        this.p.strokeWeight(1);

        this.edges.forEach(edge => {

            line(edge.a.getCoordinates().x, edge.a.getCoordinates().y, edge.b.getCoordinates().x, edge.b.getCoordinates().y);

        })

    }

}

const edge_intersect = (e1, e2) => {

    if (e1.a == e2.a || e1.a == e2.b || e1.b == e2.a || e1.b == e2.b) 
        return false
    
    line1 = new Line2D.Float(
        e1.a.getCoordinates().x,
        e1.a.getCoordinates().y, 
        e1.b.getCoordinates().x, 
        e1.b.getCoordinates().y
    )

    line2 = new Line2D.Float(
        e2.a.getCoordinates().x,
        e2.a.getCoordinates().y,
        e2.b.getCoordinates().x,
        e2.b.getCoordinates().y
    )
    
    return line1.intersectsLine(line2)

}

const getAngleDifference = (e1, e2) => {

    let rota = degrees(
        new PVector(
            e1.a.getCoordinates().x, 
            e1.a.getCoordinates().y
        ).sub(
            new PVector(
                e1.b.getCoordinates().x,
                e1.b.getCoordinates().y
            )
        ).heading()
    )

    const rotb = degrees(
        new PVector(
            e2.a.getCoordinates().x,
            e2.a.getCoordinates().y
        ).sub(
            new PVector(
                e2.b.getCoordinates().x,
                e2.b.getCoordinates().y
            )
        ).heading()
    )

    const phi = Math.abs(rotb - rota) % 360
    const sign = (rota - rotb >= 0 && rota - rotb <= 180) || 
                 (rota - rotb <=-180 && rota - rotb>= -360) ? 
                 1 : -1
    const diff = phi > 180 ? 360 - phi : phi

    return sign * diff
    
}
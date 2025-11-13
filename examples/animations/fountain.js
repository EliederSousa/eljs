// ----------------------------------------------------------------

import { CircleObject } from "./objects/Circle.js";
import { MovableObject } from "./objects/MovableObject.js";
import { RigidBody } from "./objects/RigidBody.js";
import { Shape } from "./objects/Shape.js";
import { World } from "./objects/World.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";
import { GradientColor } from "./util/GradientColor.js";
import { MathHelper } from "./util/MathHelper.js";
import { Properties } from "./core/Properties.js";

let world = new World();
Properties.velocityLine = false;

// ----------------------------------------------------------------

let waterGradient = new GradientColor();
waterGradient.addColor(new Color(1, 1, 1, .3))
waterGradient.addColor(new Color(0, .5, .7, .2))
waterGradient.addColor(new Color(0, 0, .5, .1))

class Particle extends RigidBody {
    constructor(pos, vel) {
        let shape = new CircleObject(new Point(pos.x, pos.y), {
            color: waterGradient,
            radius: 10,
            drawMode: Shape.drawModes.CENTER,
            maxTime: 5000
        });
        let velNormal = vel.clone().scale(2);
        let movable = new MovableObject(new Point(pos.x, pos.y), {
            velocity: new Point(velNormal.x, velNormal.y)
        })
        super(shape, movable);
    }

    /** @override */
    update() {
        this.movableObject.update();
    }

    /** @override */
    clone(newPos) {
        // Define uma direção e magnitude aleatórias
        const vel = new Point(-MathHelper.randomBetween(-.5, .5), -MathHelper.randomBetween(5, 6));
        return new Particle(newPos.clone(), vel);
    }
}

let waterParticle = new Particle(new Point(0, 0), new Point(0, -1))

// ----------------------------------------------------------------

world.addEmitter({
    minTime: 2,
    maxTime: 3,
    radius: 2,
    position: new Point(1000, 500),
    particle: waterParticle
})

world.run();
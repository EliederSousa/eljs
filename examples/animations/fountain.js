// ----------------------------------------------------------------

import { CircleObject } from "../../src/objects/Circle.js";
import { MovableObject } from "../../src/objects/MovableObject.js";
import { RigidBody } from "../../src/objects/RigidBody.js";
import { Shape } from "../../src/objects/Shape.js";
import { World } from "../../src/objects/World.js";
import { Point } from "../../src/physics/Point.js";
import { Color } from "../../src/util/Color.js";
import { GradientColor } from "../../src/util/GradientColor.js";
import { MathHelper } from "../../src/util/MathHelper.js";
import { Properties } from "../../src/core/Properties.js";

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
            radius: 6 + (Math.random() * 5),
            drawMode: Shape.drawModes.CENTER,
            maxTime: 5000
        });
        let velNormal = vel.clone().scale(1);
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
        const vel = new Point(-MathHelper.randomBetween(-1, 1), -MathHelper.randomBetween(10, 12));
        return new Particle(newPos.clone(), vel);
    }
}

let waterParticle = new Particle(new Point(0, 0), new Point(0, -1))

// ----------------------------------------------------------------

world.addEmitter({
    minTime: 1,
    maxTime: 3,
    radius: 1,
    position: new Point(world.screen.center.x, 500),
    particle: waterParticle
})

world.run();
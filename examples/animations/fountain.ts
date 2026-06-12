/**
 * Fountain particle animation — blue water droplets burst upward from
 * the bottom centre of the screen and fall with gravity.
 *
 * Particles use a blue `GradientColor` and have randomised size and velocity.
 */
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

const world = new World();
Properties.velocityLine = false;

const waterGradient = new GradientColor();
waterGradient.addColor(new Color(1, 1, 1, 0.3));
waterGradient.addColor(new Color(0, 0.5, 0.7, 0.2));
waterGradient.addColor(new Color(0, 0, 0.5, 0.1));

/**
 * Particle — a water droplet with randomised size and upward velocity.
 */
class Particle extends RigidBody {
    constructor(pos: Point, vel: Point) {
        const shape = new CircleObject(pos.clone(), {
            color: waterGradient,
            radius: 6 + Math.random() * 5,
            drawMode: Shape.drawModes.CENTER,
            maxTime: 5000,
        });
        const velNormal = vel.clone().scale(1);
        const movable = new MovableObject(pos.clone(), shape, {
            velocity: new Point(velNormal.x, velNormal.y),
        });
        super(shape, movable);
    }

    update(): void {
        this.movableObject.update();
    }

    clone(newPos: Point): Particle {
        const vel = new Point(
            -MathHelper.randomBetween(-1, 1),
            -MathHelper.randomBetween(10, 12),
        );
        return new Particle(newPos.clone(), vel);
    }
}

const waterParticle = new Particle(new Point(0, 0), new Point(0, -1));

world.addEmitter({
    minTime: 1,
    maxTime: 3,
    radius: 1,
    position: new Point(world.screen.center.x, 500),
    particle: waterParticle,
});

world.run();

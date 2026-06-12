/**
 * Fire particle animation — spawns glowing embers from the centre of the
 * screen using a custom `Particle` class with `GradientColor`.
 *
 * Each particle rises slowly and fades out over ~1 second.
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

const world = new World();

// Warm gradient for fire glow
const fireGradient = new GradientColor();
fireGradient.addColor(new Color(0.3, 0.2, 0.1, 0.3));
fireGradient.addColor(new Color(0.2, 0, 0, 0.01));

/**
 * Particle — a fire ember with gradient colour and upward velocity.
 */
class Particle extends RigidBody {
    constructor(pos: Point, vel: Point) {
        const shape = new CircleObject(pos.clone(), {
            color: fireGradient,
            radius: 30,
            maxTime: 1000,
        });
        const velNormal = vel.clone().scale(2);
        const movable = new MovableObject(pos.clone(), shape, {
            velocity: new Point(velNormal.x, velNormal.y),
        });
        super(shape, movable);
    }

    update(): void {
        this.movableObject.update();
    }

    clone(newPos: Point): Particle {
        const vel = new Point(0, -MathHelper.randomBetween(0.5, 2));
        return new Particle(newPos.clone(), vel);
    }
}

const fireParticle = new Particle(new Point(0, 0), new Point(0, -1));

world.addEmitter({
    minTime: 1,
    maxTime: 2,
    radius: 30,
    position: new Point(world.getScreenCenter().x, world.getScreenCenter().y),
    particle: fireParticle,
});

world.run();

/**
 * Fire2 particle animation — like `fire.ts`, but particles are attracted
 * towards the mouse cursor instead of moving straight up.
 *
 * Move the mouse to steer the embers.
 */
import { CircleObject } from "../../src/objects/Circle.js";
import { MovableObject } from "../../src/objects/MovableObject.js";
import { RigidBody } from "../../src/objects/RigidBody.js";
import { Shape } from "../../src/objects/Shape.js";
import { World } from "../../src/objects/World.js";
import { Point } from "../../src/physics/Point.js";
import { Color } from "../../src/util/Color.js";
import { GradientColor } from "../../src/util/GradientColor.js";
import { Mouse } from "../../src/input/Mouse.js";

const world = new World();

const fireGradient = new GradientColor();
fireGradient.addColor(new Color(0.3, 0.2, 0.1, 0.3));
fireGradient.addColor(new Color(0.2, 0, 0, 0.01));

/**
 * Particle — a fire ember that moves toward the mouse cursor.
 */
class Particle extends RigidBody {
    constructor(pos: Point, vel: Point) {
        const shape = new CircleObject(pos.clone(), {
            color: fireGradient,
            radius: 30,
            drawMode: Shape.drawModes.CENTER,
            maxTime: 5000,
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
        const dist = new Point(Mouse.x, Mouse.y).distanceTo(newPos);
        const vel = new Point(Mouse.x - newPos.x, Mouse.y - newPos.y)
            .normal()
            .scale(dist / 100);
        return new Particle(newPos.clone(), vel);
    }
}

const fireParticle = new Particle(new Point(0, 0), new Point(0, -1));

world.addEmitter({
    minTime: 1,
    maxTime: 1,
    radius: 40,
    position: new Point(world.getScreenCenter().x, world.getScreenCenter().y),
    particle: fireParticle,
});

world.run();

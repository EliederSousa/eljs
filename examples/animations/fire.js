import { Properties } from "./core/Properties.js";
import { Keyboard } from "./input/Keyboard.js";
import { CircleObject } from "./objects/Circle.js";
import { EmmiterManager } from "./objects/Emmiter.js";
import { MovableObject } from "./objects/MovableObject.js";
import { RigidBody } from "./objects/RigidBody.js";
import { Shape } from "./objects/Shape.js";
import { World } from "./objects/World.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";
import { GradientColor } from "./util/GradientColor.js";
import { MathHelper } from "./util/MathHelper.js";

// ----------------------------------------------------------------
// Crie e declare os objetos/propriedades globais

let world = new World();

// ----------------------------------------------------------------
// Crie as classes personalizadas

let fireGradient = new GradientColor();
fireGradient.addColor(new Color(.3, .2, .1, .3))
fireGradient.addColor(new Color(.2, 0, 0, .01))

class Particle extends RigidBody {
    constructor(pos, vel) {
        let shape = new CircleObject(new Point(pos.x, pos.y), {
            color: fireGradient,
            radius: 30,
            drawMode: Shape.drawModes.CENTER,
            maxTime: 1000
        });
        let velNormal = vel.clone().scale(2);
        let movable = new MovableObject(new Point(pos.x, pos.y), {
            velocity: new Point(velNormal.x, velNormal.y),
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
        const vel = new Point(0, -MathHelper.randomBetween(.5, 2));
        return new Particle(newPos.clone(), vel);
    }
}

let fireParticle = new Particle(new Point(0, 0), new Point(0, -1))

// ----------------------------------------------------------------
// Crie os outros objetos que dependem das classes personalizadas

world.addEmitter({
    minTime: 1,
    maxTime: 2,
    radius: 30,
    position: new Point(world.getScreenCenter().x, world.getScreenCenter().y),
    particle: fireParticle
})

// ----------------------------------------------------------------

world.run();
import { Properties } from "../../src/core/Properties.js";
import { Keyboard } from "../../src/input/Keyboard.js";
import { Mouse } from "../../src/input/Mouse.js";
import { CircleObject } from "../../src/objects/Circle.js";
import { EmmiterManager } from "../../src/objects/Emmiter.js";
import { MovableObject } from "../../src/objects/MovableObject.js";
import { RigidBody } from "../../src/objects/RigidBody.js";
import { Shape } from "../../src/objects/Shape.js";
import { World } from "../../src/objects/World.js";
import { Point } from "../../src/physics/Point.js";
import { Color } from "../../src/util/Color.js";
import { GradientColor } from "../../src/util/GradientColor.js";
import { MathHelper } from "../../src/util/MathHelper.js";

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
            maxTime: 5000
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
        // Define direção e velocidade baseado no cursor do mouse
        let dist = new Point(Mouse.x, Mouse.y).distanceTo(newPos)
        let vel = new Point(Mouse.x - newPos.x, Mouse.y - newPos.y).normal().scale(dist / 100)
        // Define uma direção e magnitude aleatórias
        //const vel = new Point(0, -MathHelper.randomBetween(.5, 2));
        return new Particle(newPos.clone(), vel);
    }
}

let fireParticle = new Particle(new Point(0, 0), new Point(0, -1))

// ----------------------------------------------------------------
// Crie os outros objetos que dependem das classes personalizadas

world.addEmitter({
    minTime: 1,
    maxTime: 1,
    radius: 40,
    position: new Point(world.getScreenCenter().x, world.getScreenCenter().y),
    particle: fireParticle
})

// ----------------------------------------------------------------

world.run();
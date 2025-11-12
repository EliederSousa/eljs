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

let world = new World();
Properties.velocityLine = false;

// ----------------------------------------------------------------

class Bullet extends RigidBody {
    constructor(pos, vel) {
        let shape = new CircleObject(new Point(pos.x, pos.y), {
            //color: new Color(Color.colors.acid_green),
            color: grad,
            //lineColor: new Color(Color.colors.aliceblue),
            //lineWidth: 3,
            radius: 5,
            drawMode: Shape.drawModes.CENTER
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
}

let grad = new GradientColor();
grad.addColor(new Color(.3, .2, .1, .3))
grad.addColor(new Color(.2, 0, 0, .01))


let player = new RigidBody(new CircleObject(new Point(0, 0), {
    radius: 50,
    color: grad,
    //lineColor: new Color(Color.colors.gray),
    //lineWidth: 2,
    drawMode: Shape.drawModes.VERTICES
}), new MovableObject(new Point(100, 100), { velocity: new Point(0, 0) }));


class Particle extends RigidBody {
    constructor(pos, vel) {
        let shape = new CircleObject(new Point(pos.x, pos.y), {
            color: grad,
            //lineColor: new Color(Color7.colors.aliceblue),
            //lineWidth: 3,
            radius: 40,
            drawMode: Shape.drawModes.CENTER
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
        const vel = new Point(0, -MathHelper.randomBetween(.8, 2));
        return new Particle(newPos.clone(), vel);
    }
}

let fireParticle = new Particle(new Point(0, 0), new Point(0, -1))

// ----------------------------------------------------------------

world.add(player);
world.addEmitter({
    minTime: 10,
    maxTime: 20,
    radius: 40,
    position: new Point(800, 600),
    particle: fireParticle
})
function main() {
    if (Keyboard.isDown(Keyboard.UP)) player.movableObject.applyForce(new Point(0, -.2));
    if (Keyboard.isDown(Keyboard.DOWN)) player.movableObject.applyForce(new Point(0, .2));
    if (Keyboard.isDown(Keyboard.LEFT)) player.movableObject.applyForce(new Point(-.2, 0));
    if (Keyboard.isDown(Keyboard.RIGHT)) player.movableObject.applyForce(new Point(.2, 0));
    if (Keyboard.isDown(Keyboard.SPACE)) world.add(new Bullet(player.shape.position, player.movableObject.velocity));
}

world.registerMainFunction(main);
world.run();
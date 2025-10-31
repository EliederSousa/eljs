import { Keyboard } from "./input/Keyboard.js";
import { CircleObject } from "./objects/Circle.js";
import { MovableObject } from "./objects/MovableObject.js";
import { RigidBody } from "./objects/RigidBody.js";
import { Shape } from "./objects/Shape.js";
import { World } from "./objects/World.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";

let world = new World();

// ----------------------------------------------------------------

class Bullet extends RigidBody {
    constructor(pos, vel) {
        let shape = new CircleObject(new Point(pos.x, pos.y), {
            color: new Color(Color.colors.acid_green),
            lineColor: new Color(Color.colors.aliceblue),
            lineWidth: 3,
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

let player = new RigidBody(new CircleObject(new Point(0, 0), {
    radius: 10,
    color: new Color(Color.colors.cyan),
    lineColor: new Color(Color.colors.gray),
    lineWidth: 2
}), new MovableObject(new Point(100, 100), { velocity: new Point(0, 0) }));

// ----------------------------------------------------------------

world.add(player);
function main() {
    if (Keyboard.isDown(Keyboard.UP)) player.movableObject.applyForce(new Point(0, -.2));
    if (Keyboard.isDown(Keyboard.DOWN)) player.movableObject.applyForce(new Point(0, .2));
    if (Keyboard.isDown(Keyboard.LEFT)) player.movableObject.applyForce(new Point(-.2, 0));
    if (Keyboard.isDown(Keyboard.RIGHT)) player.movableObject.applyForce(new Point(.2, 0));
    if (Keyboard.isDown(Keyboard.SPACE)) world.add(new Bullet(player.shape.position, player.movableObject.velocity));
}

world.registerMainFunction(main);
world.run();
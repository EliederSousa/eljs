/**
 * Movable example — a physics sandbox with a controllable ball,
 * bullet spawning, and camera zoom.
 *
 * Controls:
 * - Arrow keys  → apply force to the ball
 * - Space       → spawn a bullet in the ball's direction
 * - Numpad 7/9  → zoom out / in
 */
import { Screen } from "../src/core/Screen.js";
import { Keyboard } from "../src/input/Keyboard.js";
import { Camera } from "../src/objects/Camera.js";
import { CircleObject } from "../src/objects/Circle.js";
import { MovableObject } from "../src/objects/MovableObject.js";
import { RigidBody } from "../src/objects/RigidBody.js";
import { Shape } from "../src/objects/Shape.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";
import { DebugBox } from "../src/util/DebugBox.js";
import { ObjectContainer } from "../src/util/ObjectContainer.js";

const screen = new Screen("fullscreen");
const objects = new ObjectContainer<RigidBody>();
const debugBox = new DebugBox(new Point(5, 5), {
    container: objects,
});

const circleShape = new CircleObject(new Point(20, 20), {
    color: new Color(Color.colors.acid_green),
    radius: 10,
    drawMode: Shape.drawModes.CENTER,
});
const ball = new RigidBody(
    circleShape,
    new MovableObject(circleShape.position.clone(), circleShape, {
        velocity: new Point(5, 0),
    }),
);

objects.add(ball);

/**
 * Bullet — a fast-moving circle fired in a given direction.
 */
class Bullet extends RigidBody {
    constructor(pos: Point, vel: Point) {
        const shape = new CircleObject(pos.clone(), {
            color: new Color(Color.colors.acid_green),
            lineColor: new Color(Color.colors.aliceblue),
            lineWidth: 3,
            radius: 5,
            drawMode: Shape.drawModes.CENTER,
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
}

const camera = new Camera(new Point(0, 0), { zoom: 1 });

function loop(): void {
    if (Keyboard.isDown(Keyboard.UP)) ball.movableObject.applyForce(new Point(0, -0.2));
    if (Keyboard.isDown(Keyboard.DOWN)) ball.movableObject.applyForce(new Point(0, 0.2));
    if (Keyboard.isDown(Keyboard.LEFT)) ball.movableObject.applyForce(new Point(-0.2, 0));
    if (Keyboard.isDown(Keyboard.RIGHT)) ball.movableObject.applyForce(new Point(0.2, 0));
    if (Keyboard.isDown(Keyboard.NUM7)) camera.zoom -= 0.05;
    if (Keyboard.isDown(Keyboard.NUM9)) camera.zoom += 0.05;
    if (Keyboard.isDown(Keyboard.SPACE)) {
        objects.add(new Bullet(ball.shape.position, ball.movableObject.velocity));
    }

    screen.draw();

    for (let w = 0; w < objects.getCount(); w++) {
        const obj = objects.getObject(w)!;
        obj.applyForce(new Point(0, 0.05));
        obj.update();
        screen.drawItem(obj.movableObject, camera);
    }
    screen.drawItem(debugBox);
    requestAnimationFrame(loop);
}

loop();

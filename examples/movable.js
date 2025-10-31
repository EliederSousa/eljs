import { Screen } from "./core/Screen.js";
import { Keyboard } from "./input/Keyboard.js";
import { Camera } from "./objects/Camera.js";
import { CircleObject } from "./objects/Circle.js";
import { MovableObject } from "./objects/MovableObject.js";
import { RigidBody } from "./objects/RigidBody.js";
import { Shape } from "./objects/Shape.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";
import { DebugBox } from "./util/DebugBox.js";
import { ObjectContainer } from "./util/ObjectContainer.js";

let sc = new Screen("fullscreen");
let obj = new ObjectContainer();
let box = new DebugBox(new Point(5, 5), {
    container: obj
});

let ball = new RigidBody(new CircleObject(new Point(20, 20), {
    color: new Color(Color.colors.acid_green),
    radius: 10,
    drawMode: Shape.drawModes.CENTER
}), new MovableObject(new Point(10, 10), {
    velocity: new Point(5, 0),
}));

obj.add(ball);


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

let camera = new Camera(new Point(0, 0), { zoom: 1 });

function loop() {
    if (Keyboard.isDown(Keyboard.UP)) ball.movableObject.applyForce(new Point(0, -.2));
    if (Keyboard.isDown(Keyboard.DOWN)) ball.movableObject.applyForce(new Point(0, .2));
    if (Keyboard.isDown(Keyboard.LEFT)) ball.movableObject.applyForce(new Point(-.2, 0));
    if (Keyboard.isDown(Keyboard.RIGHT)) ball.movableObject.applyForce(new Point(.2, 0));
    if (Keyboard.isDown(Keyboard.NUM7)) camera.zoom -= .05;
    if (Keyboard.isDown(Keyboard.NUM9)) camera.zoom += .05;
    if (Keyboard.isDown(Keyboard.SPACE)) obj.add(new Bullet(ball.shape.position, ball.movableObject.velocity));
    sc.draw();

    for (let w = 0; w < obj.getCount(); w++) {
        let o = obj.getObject(w);
        o.applyForce(new Point(0, .05))
        o.update();
        sc.drawItem(o.movableObject, camera);
    }
    sc.drawItem(box);
    requestAnimationFrame(loop);
}

loop();


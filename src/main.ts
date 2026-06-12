import { Properties } from "./core/Properties";
import { CircleObject } from "./objects/Circle";
import { RectangleObject } from "./objects/Rectangle";
import { RigidBody } from "./objects/RigidBody";
import { World } from "./objects/World";
import { Point } from "./physics/Point";
import { Color } from "./util/Color";

const BALL_RADIUS = 10;
const SPREAD = 40;

let balls: RigidBody[] = [];
for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const offset = new Point(Math.cos(angle) * SPREAD, Math.sin(angle) * SPREAD);
    balls.push(new RigidBody({
        shape: new CircleObject(new Point(100 + offset.x, 100 + offset.y), {
            radius: BALL_RADIUS,
            color: Color.fromName("white"),
        }),
        velocity: new Point(8.5, (Math.random() - 0.5) * 20),
    }));
}

let floor = new RigidBody({
    shape: new RectangleObject(new Point(20, 400), {
        width: 400,
        height: 10,
        color: Color.fromName("white"),
    }),
    velocity: new Point(0, 0),
    mass: Infinity,
    isStatic: true
})

let floor2 = new RigidBody({
    shape: new RectangleObject(new Point(20, 200), {
        width: 200,
        height: 10,
        color: Color.fromName("white"),
    }),
    velocity: new Point(0, 0),
    mass: Infinity,
    isStatic: true
})

let floor3 = new RigidBody({
    shape: new RectangleObject(new Point(275, 300), {
        width: 200,
        height: 10,
        color: Color.fromName("white"),
    }),
    velocity: new Point(0, 0),
    mass: Infinity,
    isStatic: true
})

let w = new World();
w.screen.setBackgroundColor(Color.fromName("black"));
balls.forEach(b => w.add(b));
w.add(floor);
w.add(floor2);
w.add(floor3);
w.run();
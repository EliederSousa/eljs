import { CircleObject } from "./objects/Circle";
import { MovableObject } from "./objects/MovableObject";
import { RigidBody } from "./objects/RigidBody";
import { World } from "./objects/World";
import { Point } from "./physics/Point";
import { Color } from "./util/Color";

let c = new CircleObject(new Point(100, 100), {
    radius: 10,
    color: Color.fromName("white")
});

let r = new RigidBody(c, new MovableObject(c.position.clone(), c, {
    velocity: new Point(0, 1)
}));

let w = new World();
w.screen.setBackgroundColor(Color.fromName("black"));
w.add(r);
w.run();
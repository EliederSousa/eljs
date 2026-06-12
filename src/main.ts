import { Properties } from "./core/Properties";
import { CircleObject } from "./objects/Circle";
import { MovableObject } from "./objects/MovableObject";
import { PolygonObject } from "./objects/Polygon";
import { RectangleObject } from "./objects/Rectangle";
import { RigidBody } from "./objects/RigidBody";
import { SquareObject } from "./objects/Square";
import { World } from "./objects/World";
import { Point } from "./physics/Point";
import { Color } from "./util/Color";

let r = new RigidBody({
    shape: new CircleObject(new Point(100, 100), {
        radius: 10,
        color: Color.fromName("white"),
    }),
    velocity: new Point(0, 0),
    isStatic: true,
})

function main() {
    r.movableObject.rotation += 0
}

Properties.gravity = 2;
let w = new World();
w.registerMainFunction(main)
w.screen.setBackgroundColor(Color.fromName("black"));
w.add(r);
w.run();
import { CircleObject } from "../src/objects/Circle.js";
import { World } from "../src/objects/World.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";

let world = new World();
world.addEmitter({
    position: new Point(300, 200),
    radius: 100,
    color: new Color(.5, .2, .1, 0.4),
    minTime: 100,
    maxTime: 500,
    particle: new CircleObject(new Point(0, 0), {
        radius: 2,
        color: new Color(Color.colors.aloe_vera_green),
    })
})
world.run();
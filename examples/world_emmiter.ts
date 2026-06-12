/**
 * World + Emitter example — creates a particle emitter that spawns
 * small green circles inside a circular area.
 *
 * The emitter fires at random intervals between 100 ms and 500 ms.
 */
import { CircleObject } from "../src/objects/Circle.js";
import { World } from "../src/objects/World.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";

const world = new World();
world.addEmitter({
    position: new Point(300, 200),
    radius: 100,
    color: new Color(0.5, 0.2, 0.1, 0.4),
    minTime: 100,
    maxTime: 500,
    particle: new CircleObject(new Point(0, 0), {
        radius: 2,
        color: new Color(Color.colors.aloe_vera_green),
    }),
});
world.run();

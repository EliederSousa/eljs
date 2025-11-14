import { LineObject } from "./objects/Line.js";
import { World } from "./objects/World.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";
import { ObjectContainer } from "./util/ObjectContainer.js";

let world = new World();

class Grid {
    constructor() {
        this.lines = new ObjectContainer();
        this.numlines = 10;
        this.xcellsize = world.screen.width / this.numlines;
        this.ycellsize = world.screen.height / this.numlines;

        for (let x = 0; x < this.numlines; x++) {
            this.lines.add(new LineObject(new Point(x * this.xcellsize, -10000), {
                lineColor: new Color(Color.colors.green_onion),
                lineWidth: .1,
                to: new Point(x * this.xcellsize, 10000)
            }))
        }
        for (let y = 0; y < this.numlines; y++) {
            this.lines.add(new LineObject(new Point(-10000, y * this.ycellsize), {
                lineColor: new Color(Color.colors.green_onion),
                lineWidth: .1,
                to: new Point(10000, y * this.ycellsize)
            }))
        }
    }

    draw() {
        for (let w = 0; w < this.lines.getCount(); w++) {
            world.screen.drawItem(this.lines.getObject(w), world.camera)
        }
    }
}

let g = new Grid();
world.registerMainFunction(_ => g.draw());
world.run();
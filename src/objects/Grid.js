import { ObjectContainer } from "../util/ObjectContainer.js";
import { Color } from "../util/Color.js";
import { Point } from "../physics/Point.js";
import { LineObject } from "./Line.js";

export class Grid {
    constructor(world) {
        this.lines = new ObjectContainer();
        this.separation = 50;
        this.linewidth = .1;
        this.linecolor = new Color(Color.colors.green_onion);

        for (let x = 0; x < world.screen.width; x += this.separation) {
            this.lines.add(new LineObject(new Point(x, -10000), {
                lineColor: this.linecolor,
                lineWidth: this.linewidth,
                to: new Point(x, 10000)
            }))
        }
        for (let y = 0; y < world.screen.height; y += this.separation) {
            this.lines.add(new LineObject(new Point(-10000, y), {
                lineColor: this.linecolor,
                lineWidth: this.linewidth,
                to: new Point(10000, y)
            }))
        }
    }

    setLineWidth(x) {
        this.linewidth = x;
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w).lineWidth = this.linewidth;
        }
    }

    setLineColor(color) {
        this.linecolor = color;
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w).lineColor = this.linecolor;
        }
    }

    draw(canvas_context) {
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w).draw(canvas_context);
        }
    }
}
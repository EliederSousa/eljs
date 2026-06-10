import { ObjectContainer } from "../util/ObjectContainer.js";
import { Color } from "../util/Color.js";
import { Point } from "../physics/Point.js";
import { LineObject } from "./Line.js";

/**
 * Grid — draws a rectangular grid of lines across the screen.
 *
 * Typically used as a background reference for physics or camera demos.
 */
export class Grid {
    lines: ObjectContainer<LineObject>;
    separation: number;
    linewidth: number;
    linecolor: Color;

    constructor(world: { screen: { width: number; height: number } }) {
        this.lines = new ObjectContainer();
        this.separation = 50;
        this.linewidth = 0.1;
        this.linecolor = new Color(Color.colors.green_onion as unknown as number[]);

        for (let x = 0; x < world.screen.width; x += this.separation) {
            this.lines.add(new LineObject(new Point(x, -10000), {
                lineColor: this.linecolor,
                lineWidth: this.linewidth,
                to: new Point(x, 10000),
            }));
        }
        for (let y = 0; y < world.screen.height; y += this.separation) {
            this.lines.add(new LineObject(new Point(-10000, y), {
                lineColor: this.linecolor,
                lineWidth: this.linewidth,
                to: new Point(10000, y),
            }));
        }
    }

    /** Sets the line width for all grid lines. */
    setLineWidth(x: number): void {
        this.linewidth = x;
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w)!.lineWidth = this.linewidth;
        }
    }

    /** Sets the line colour for all grid lines. */
    setLineColor(color: Color): void {
        this.linecolor = color;
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w)!.lineColor = this.linecolor;
        }
    }

    draw(canvas_context: CanvasRenderingContext2D): void {
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w)!.draw(canvas_context);
        }
    }
}

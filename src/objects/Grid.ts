import { ObjectContainer } from "../util/ObjectContainer.js";
import { Color } from "../util/Color.js";
import { Point } from "../physics/Point.js";
import { LineObject } from "./Line.js";

/**
 * Grid — draws a rectangular grid of lines across the screen.
 *
 * Typically used as a background reference for physics or camera demos.
 *
 * @example
 * const grid = new Grid(world);
 * grid.draw(ctx); // or pass through screen.drawItem(grid, camera)
 */
export class Grid {
    /** Container holding all vertical and horizontal line objects. */
    lines: ObjectContainer<LineObject>;
    /** Pixel distance between consecutive grid lines. Default: 50. */
    separation: number;
    /** Stroke width of each grid line. Default: 0.1. */
    linewidth: number;
    /** Stroke colour of each grid line. Default: green_onion. */
    linecolor: Color;

    /**
     * Builds a full-screen grid from the world's screen dimensions.
     * Vertical lines span from y = -10000 to 10000, horizontal lines from x = -10000 to 10000.
     * @param world - Object with a `screen` property exposing `width` and `height`.
     */
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

    /**
     * Updates the stroke width of every grid line.
     * @param x - New line width in pixels.
     */
    setLineWidth(x: number): void {
        this.linewidth = x;
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w)!.lineWidth = this.linewidth;
        }
    }

    /**
     * Updates the stroke colour of every grid line.
     * @param color - New colour for all grid lines.
     */
    setLineColor(color: Color): void {
        this.linecolor = color;
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w)!.lineColor = this.linecolor;
        }
    }

    /**
     * Draws every grid line to the canvas.
     * @param canvas_context - Canvas 2D rendering context.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        for (let w = 0; w < this.lines.getCount(); w++) {
            this.lines.getObject(w)!.draw(canvas_context);
        }
    }
}

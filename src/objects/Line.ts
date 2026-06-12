import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { MathHelper } from "../util/MathHelper.js";
import { Shape } from "./Shape.js";

/**
 * LineObject — a line segment defined by a start point (inherited `position`) and an end point (`to`).
 *
 * @example
 * const line = new LineObject(new Point(0, 0), {
 *   to: new Point(100, 100),
 *   lineColor: new Color(1, 0, 0, 1),
 *   lineWidth: 2,
 * });
 */
export class LineObject extends Shape {
    /** End point of the line segment. */
    to: Point;

    /**
     * @param position - Start point of the line.
     * @param conf - Configuration with required `to` point and optional Shape properties (color, lineColor, lineWidth, drawMode, etc.).
     */
    constructor(position: Point, conf: { to: Point } & Record<string, any>) {
        const config: any = { ...conf, type: "Line" };
        config.rotation = conf.rotation ?? 0;
        config.visible = conf.visible ?? true;
        config.color = conf.color ?? new Color(1, 1, 1, 1);
        config.lineColor = conf.lineColor;
        config.lineWidth = conf.lineWidth;

        config.vertices = [
            position.clone(),
            conf.to.clone(),
        ];

        super(position, config);
        this.to = conf.to;
    }

    /**
     * Injects the `to` point into the clone configuration.
     * Called internally by `Shape.clone()`.
     */
    protected _localClone(conf: any): void {
        conf.to = this.to;
    }

    /**
     * Draws the line segment on the canvas.
     * Handles `UPLEFT`, `CENTER`, and `VERTICES` draw modes.
     * Rotation is applied around the line's midpoint.
     * @param canvas_context - Canvas 2D rendering context.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        if (!this.visible) return;
        this.updateVertices();
        super.drawVertices(canvas_context);
    }

    /**
     * Recalculates vertices applying `this.rotation` around the midpoint.
     */
    updateVertices(): void {
        const dx = this.to.x - this.position.x;
        const dy = this.to.y - this.position.y;
        const mx = this.position.x + dx / 2;
        const my = this.position.y + dy / 2;
        const cos = Math.cos(MathHelper._PI180 * this.rotation);
        const sin = Math.sin(MathHelper._PI180 * this.rotation);
        const hdx = dx / 2;
        const hdy = dy / 2;
        this.vertices = [
            new Point(mx + (-hdx) * cos - (-hdy) * sin, my + (-hdx) * sin + (-hdy) * cos),
            new Point(mx + hdx * cos - hdy * sin, my + hdx * sin + hdy * cos),
        ];
    }
}

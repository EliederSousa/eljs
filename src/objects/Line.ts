import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
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
        config.drawMode = conf.drawMode ?? "UPLEFT";

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
     * @param canvas_context - Canvas 2D rendering context.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        if (!this.visible) return;
        if (this.drawMode === "VERTICES") {
            super.drawVertices(canvas_context);
        } else {
            canvas_context.save();
            let temppos: Point;
            let tempwidth: number;
            let tempheight: number;

            if (this.drawMode === "CENTER") {
                tempwidth = this.to.x - this.position.x;
                tempheight = this.to.y - this.position.y;
                temppos = new Point(this.position.x - tempwidth / 2, this.position.y - tempheight / 2);
            } else {
                temppos = this.position;
                tempwidth = this.to.x - this.position.x;
                tempheight = this.to.y - this.position.y;
            }

            if (this.lineColor && this.lineWidth) {
                canvas_context.strokeStyle = (this.lineColor as any).CSS ?? this.lineColor as any;
                canvas_context.lineWidth = this.lineWidth;
            }

            canvas_context.beginPath();
            canvas_context.moveTo(temppos.x, temppos.y);
            canvas_context.lineTo(temppos.x + tempwidth, temppos.y + tempheight);
            canvas_context.closePath();
            canvas_context.stroke();
            canvas_context.restore();
        }
    }
}

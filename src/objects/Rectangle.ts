import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Shape } from "./Shape.js";

/**
 * Config accepted by `RectangleObject` constructor.
 */
export interface RectangleConfig {
    width: number;
    height: number;
    color?: Color;
    lineColor?: Color;
    lineWidth?: number;
    drawMode?: string;
    rotation?: number;
    visible?: boolean;
}

/**
 * RectangleObject — rectangular shape with configurable width, height, and draw mode.
 *
 * @example
 * const rect = new RectangleObject(new Point(100, 100), {
 *   width: 80,
 *   height: 40,
 *   color: new Color(1, 0, 0, 1),
 *   drawMode: "CENTER",
 * });
 */
export class RectangleObject extends Shape {
    width: number;
    height: number;

    constructor(position: Point, conf: RectangleConfig) {
        if (!(position instanceof Point)) {
            throw new Error("RectangleObject::constructor: position não é instância da classe Point.");
        }

        const config: any = { ...conf, type: "Rectangle" };
        config.rotation = conf.rotation ?? 0;
        config.visible = conf.visible ?? true;
        config.color = conf.color ?? new Color(1, 1, 1, 1);
        config.lineColor = conf.lineColor;
        config.lineWidth = conf.lineWidth;
        config.drawMode = conf.drawMode ?? "UPLEFT";

        const halfx = conf.width / 2;
        const halfy = conf.height / 2;
        config.vertices = [
            position.clone().add(-halfx, -halfy),
            position.clone().add(halfx, -halfy),
            position.clone().add(halfx, halfy),
            position.clone().add(-halfx, halfy),
        ];

        super(position, config);
        this.width = conf.width;
        this.height = conf.height;
    }

    updateVertices(): void {
        const halfx = this.width / 2;
        const halfy = this.height / 2;
        this.vertices = [
            this.position.clone().add(-halfx, -halfy),
            this.position.clone().add(halfx, -halfy),
            this.position.clone().add(halfx, halfy),
            this.position.clone().add(-halfx, halfy),
        ];
    }

    protected _localClone(conf: any): void {
        conf.width = this.width;
        conf.height = this.height;
    }

    draw(canvas_context: CanvasRenderingContext2D): void {
        this.updateVertices();
        if (!this.visible) return;
        if (this.drawMode === "VERTICES") {
            super.drawVertices(canvas_context);
        } else {
            canvas_context.save();
            const temppos = this.drawMode === "CENTER"
                ? new Point(this.position.x - this.width / 2, this.position.y - this.height / 2)
                : this.position;

            if (this.color) {
                canvas_context.fillStyle = (this.color as any).CSS ?? this.color as any;
                canvas_context.fillRect(temppos.x, temppos.y, this.width, this.height);
            }
            if (this.lineColor && this.lineWidth) {
                canvas_context.strokeStyle = (this.lineColor as any).CSS ?? this.lineColor as any;
                canvas_context.lineWidth = this.lineWidth;
                canvas_context.strokeRect(temppos.x, temppos.y, this.width, this.height);
            }
            canvas_context.restore();
        }
    }
}

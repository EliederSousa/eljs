import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { MathHelper } from "../util/MathHelper.js";
import { ShapeConfig } from "./Shape.js";
import { PolygonObject } from "./Polygon.js";


export interface CircleConfig extends ShapeConfig {
    /** Raio do círculo em pixels. Padrão: 10. */
    radius: number;
}

export class CircleObject extends PolygonObject {

    constructor(position: Point, conf: CircleConfig) {
        if (!(position instanceof Point)) {
            throw new Error("CircleObject::constructor: position não é instância da classe Point.");
        }

        super(position, {
            ...conf,
            radius: conf.radius ?? 10,
            type: "Circle",
        });

    }

      protected _localClone(conf: ShapeConfig): void {
        (conf as CircleConfig).radius = this.radius;
    }

    draw(canvas_context: CanvasRenderingContext2D): void {
        if (!this.visible) return;
        canvas_context.save();

        canvas_context.beginPath();

        const center = this.position;
        canvas_context.arc(center.x, center.y, this.radius, 0, MathHelper._TWOPI);

        if (this.color) {
            if (this.color.constructor.name === "GradientColor") {
                canvas_context.globalCompositeOperation = "lighter";
                const gradient = canvas_context.createRadialGradient(
                    center.x, center.y, 1,
                    center.x, center.y,
                    this.radius - (this.color as any).radiusOffset,
                );
                (this.color as any).colors.forEach((color: Color, step: number) => {
                    gradient.addColorStop(step / ((this.color as any).colors.length - 1), color.CSS);
                });
                canvas_context.fillStyle = gradient;
            } else {
                canvas_context.fillStyle = (this.color as any).CSS ?? (this.color as any);
            }
            canvas_context.fill();
        }

        if (this.lineColor && this.lineWidth) {
            canvas_context.strokeStyle = (this.lineColor as any).CSS ?? (this.lineColor as any);
            canvas_context.lineWidth = this.lineWidth;
            canvas_context.stroke();
        }

        canvas_context.restore();
    }
}

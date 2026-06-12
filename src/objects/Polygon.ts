import { Point } from "../physics/Point.js";
import { MathHelper } from "../util/MathHelper.js";
import { Shape, ShapeConfig } from "./Shape.js";

/**
 * Configuration accepted by the `PolygonObject` constructor.
 * Extends `ShapeConfig` with regular polygon parameters.
 */
export interface PolygonConfig extends ShapeConfig {
    /** Number of sides / vertices. Default: 3 (triangle). */
    sides?: number;
    /** Distance from center to each vertex in pixels. Default: 10. */
    radius?: number;
}


export class PolygonObject extends Shape {

    /** Number of sides / vertices. */
    sides: number;

    /** Distance from center to each vertex in pixels. */
    radius: number;

    /**
     * @param position - Centre of the polygon on the canvas.
     * @param conf     - Configuration object. See `PolygonConfig`.
     */
    constructor(position: Point, conf: PolygonConfig) {
        const sides = conf.sides ?? 3;
        const radius = conf.radius ?? 10;

        const vertices: Point[] = [];
        const angleStep = 360 / sides;
        for (let i = 0; i < sides; i++) {
            const angle = MathHelper._PI180 * angleStep * i;
            vertices.push(new Point(
                position.x + Math.cos(angle) * radius,
                position.y + Math.sin(angle) * radius,
            ));
        }

        super(position, {
            ...conf,
            type: conf.type ?? "Polygon",
            vertices,
        });

        this.sides = sides;
        this.radius = radius;
    }

    /**
     * Recalculates vertices around the polygon's centre, applying `this.rotation`.
     */
    updateVertices(): void {
        this.vertices = [];
        const angleStep = 360 / this.sides;
        for (let i = 0; i < this.sides; i++) {
            const angle = MathHelper._PI180 * (angleStep * i + this.rotation);
            this.vertices.push(new Point(
                this.position.x + Math.cos(angle) * this.radius,
                this.position.y + Math.sin(angle) * this.radius,
            ));
        }
    }

    /**
     * Draws the polygon via its vertices.
     * @param ctx - Canvas 2D rendering context.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        this.updateVertices();
        if (!this.visible) return;
        super.drawVertices(ctx);
    }

    /** @internal */
    protected _localClone(conf: ShapeConfig): void {
        (conf as PolygonConfig).sides = this.sides;
        (conf as PolygonConfig).radius = this.radius;
    }
}

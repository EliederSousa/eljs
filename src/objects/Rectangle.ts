import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { MathHelper } from "../util/MathHelper.js";
import { Shape } from "./Shape.js";

/**
 * Configuration accepted by the `RectangleObject` constructor.
 * Extends the visual properties available on every `Shape`.
 */
export interface RectangleConfig {
    /** Width of the rectangle in pixels. */
    width: number;
    /** Height of the rectangle in pixels. */
    height: number;
    /** Fill colour. Default: opaque white. */
    color?: Color;
    /** Stroke colour. No stroke if omitted. */
    lineColor?: Color;
    /** Stroke width in pixels. */
    lineWidth?: number;
    /** Rotation angle in degrees. Default: 0. */
    rotation?: number;
    /** Whether the rectangle is drawn. Default: true. */
    visible?: boolean;
}


export class RectangleObject extends Shape {
    /** Width of the rectangle in pixels. */
    width: number;
    /** Height of the rectangle in pixels. */
    height: number;

    /**
     * @param position - Position of the rectangle (interpreted per `drawMode`).
     * @param conf - Configuration object. See `RectangleConfig`.
     * @throws If `position` is not a `Point` instance.
     */
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

    /**
     * Recalcula os 4 vértices aplicando `this.rotation` ao redor do centro.
     */
    updateVertices(): void {
        const halfx = this.width / 2;
        const halfy = this.height / 2;
        const cx = this.position.x;
        const cy = this.position.y;
        const cos = Math.cos(MathHelper._PI180 * this.rotation);
        const sin = Math.sin(MathHelper._PI180 * this.rotation);
        const base = [
            { x: -halfx, y: -halfy },
            { x:  halfx, y: -halfy },
            { x:  halfx, y:  halfy },
            { x: -halfx, y:  halfy },
        ];
        this.vertices = base.map(v => new Point(
            cx + v.x * cos - v.y * sin,
            cy + v.x * sin + v.y * cos,
        ));
    }

    /**
     * Injects `width` and `height` into the clone configuration.
     * Called internally by `Shape.clone()`.
     */
    protected _localClone(conf: any): void {
        conf.width = this.width;
        conf.height = this.height;
    }

    /**
     * Desenha o retângulo no canvas.
     *
     * Em `VERTICES` desenha via polígono de vértices (rotação incluída).
     * Caso contrário, usa `fillRect`/`strokeRect` com transformação
     * de rotação aplicada ao centro.
     *
     * @param canvas_context - Contexto 2D do canvas.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        this.updateVertices();
        if (!this.visible) return;
        super.drawVertices(canvas_context);
    }
}

import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { MathHelper } from "../util/MathHelper.js";
import { Shape, ShapeConfig } from "./Shape.js";

// ─────────────────────────────────────────────
// Tipos auxiliares
// ─────────────────────────────────────────────

/**
 * Configuração específica de `SquareObject`.
 * Estende `ShapeConfig` adicionando o tamanho do lado.
 */
export interface SquareConfig extends ShapeConfig {
    /** Tamanho do lado do quadrado em pixels. Padrão: 10. */
    size: number;
}

export class SquareObject extends Shape {

    /** Tamanho do lado em pixels. */
    size: number;

    /**
     * @param position - Posição do quadrado (interpretada conforme `drawMode`).
     * @param conf     - Configuração do quadrado. Veja `SquareConfig`.
     * @throws Se `position` não for instância de `Point`.
     */
    constructor(position: Point, conf: SquareConfig) {
        if (!(position instanceof Point)) {
            throw new Error("SquareObject::constructor: position não é instância da classe Point.");
        }

        const half = conf.size / 2;
        const vertices: Point[] = [
            position.clone().add(-half, -half),
            position.clone().add(half, -half),
            position.clone().add(half, half),
            position.clone().add(-half, half),
        ];

        super(position, {
            ...conf,
            type: "Square",
            vertices,
        });

        this.size = conf.size ?? 10;
    }

    updateVertices(): void {
        const half = this.size / 2;
        const cx = this.position.x;
        const cy = this.position.y;
        const cos = Math.cos(MathHelper._PI180 * this.rotation);
        const sin = Math.sin(MathHelper._PI180 * this.rotation);
        const base = [
            { x: -half, y: -half },
            { x: half, y: -half },
            { x: half, y: half },
            { x: -half, y: half },
        ];
        this.vertices = base.map(v => new Point(
            cx + v.x * cos - v.y * sin,
            cy + v.x * sin + v.y * cos,
        ));
    }

    /**
     * Injeta `size` no conf de clonagem.
     * Chamado por `Shape.clone()` antes de criar a cópia.
     */
    protected _localClone(conf: ShapeConfig): void {
        (conf as SquareConfig).size = this.size;
    }

    draw(canvas_context: CanvasRenderingContext2D): void {
        this.updateVertices();
        if (!this.visible) return;
        super.drawVertices(canvas_context);
    }
}
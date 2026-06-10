import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
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

// ─────────────────────────────────────────────
// Classe SquareObject
// ─────────────────────────────────────────────

/**
 * SquareObject — shape quadrado.
 *
 * Vértices sempre calculados a partir do centro,
 * independente do `drawMode`. O modo afeta apenas
 * como a `position` é interpretada no desenho.
 *
 * Modos de desenho:
 * - `UPLEFT`   — `position` é o canto superior esquerdo (padrão).
 * - `CENTER`   — `position` é o centro do quadrado.
 * - `VERTICES` — desenhado via polígono de vértices.
 *
 * @example
 * const square = new SquareObject(new Point(100, 100), {
 *   size: 40,
 *   color: new Color(0, 1, 0, 1),
 *   drawMode: "CENTER",
 * });
 */
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
            drawMode: conf.drawMode ?? "UPLEFT",
            color: conf.color ?? new Color(1, 1, 1, 1),
            vertices,
        });

        this.size = conf.size ?? 10;
    }

    // ─────────────────────────────────────────────
    // Implementações obrigatórias de Shape
    // ─────────────────────────────────────────────

    /**
     * Recalcula os 4 vértices do quadrado a partir
     * da posição e tamanho atuais.
     * Vértices são sempre relativos ao centro.
     */
    updateVertices(): void {
        const half = this.size / 2;
        this.vertices = [
            this.position.clone().add(-half, -half),
            this.position.clone().add(half, -half),
            this.position.clone().add(half, half),
            this.position.clone().add(-half, half),
        ];
    }

    /**
     * Injeta `size` no conf de clonagem.
     * Chamado por `Shape.clone()` antes de criar a cópia.
     */
    protected _localClone(conf: ShapeConfig): void {
        (conf as SquareConfig).size = this.size;
    }

    /**
     * Desenha o quadrado no canvas.
     *
     * Em `CENTER`, subtrai metade do tamanho para que
     * `position` represente o centro visualmente.
     * Em `UPLEFT`, usa `position` diretamente.
     *
     * @param canvas_context - Contexto 2D do canvas.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        this.updateVertices();
        if (!this.visible) return;

        if (this.drawMode === "VERTICES") {
            super.drawVertices(canvas_context);
            return;
        }

        canvas_context.save();

        const origin = this.drawMode === "CENTER"
            ? new Point(this.position.x - this.size / 2, this.position.y - this.size / 2)
            : this.position;

        if (this.color) {
            canvas_context.fillStyle = (this.color as any).CSS ?? (this.color as any);
            canvas_context.fillRect(origin.x, origin.y, this.size, this.size);
        }

        if (this.lineColor && this.lineWidth) {
            canvas_context.strokeStyle = (this.lineColor as any).CSS ?? (this.lineColor as any);
            canvas_context.lineWidth = this.lineWidth;
            canvas_context.strokeRect(origin.x, origin.y, this.size, this.size);
        }

        canvas_context.restore();
    }
}
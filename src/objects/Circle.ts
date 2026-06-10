import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { MathHelper } from "../util/MathHelper.js";
import { Shape, ShapeConfig, DrawMode } from "./Shape.js";

// ─────────────────────────────────────────────
// Tipos auxiliares
// ─────────────────────────────────────────────

/**
 * Configuração específica de `CircleObject`.
 * Estende `ShapeConfig` adicionando os campos geométricos do círculo.
 */
export interface CircleConfig extends ShapeConfig {
    /** Raio do círculo em pixels. Padrão: 10. */
    radius: number;

    /**
     * Número de vértices usados para aproximar o círculo.
     * Só relevante quando `useVertices` é `true`.
     * Mais vértices = círculo mais suave, porém mais custoso.
     * Padrão: 32.
     */
    numvertices?: number;

    /**
     * Se `true`, desenha usando o polígono de vértices em vez de `arc()`.
     * Útil para reduzir qualidade em troca de performance:
     * diminua `numvertices` para um círculo mais "blocado" e mais rápido.
     * Padrão: false.
     */
    useVertices?: boolean;
}

// ─────────────────────────────────────────────
// Classe CircleObject
// ─────────────────────────────────────────────

/**
 * CircleObject — shape circular.
 *
 * Por padrão desenhado com `arc()` (suave e preciso).
 * Com `useVertices: true`, desenhado como polígono de `numvertices` lados —
 * útil para simular física com menos custo ou para efeitos visuais.
 *
 * @example
 * // Círculo suave, origem no centro
 * const circle = new CircleObject(new Point(100, 100), {
 *   radius: 30,
 *   color: new Color(1, 0, 0, 1),
 *   drawMode: "CENTER",
 * });
 *
 * @example
 * // Círculo aproximado por 8 vértices para performance
 * const lowRes = new CircleObject(new Point(100, 100), {
 *   radius: 30,
 *   drawMode: "CENTER",
 *   useVertices: true,
 *   numvertices: 8,
 * });
 */
export class CircleObject extends Shape {

    /** Raio do círculo em pixels. */
    radius: number;

    /** Número de vértices do polígono de aproximação. */
    numvertices: number;

    /**
     * Se `true`, desenha via polígono de vértices em vez de `arc()`.
     * Permite trocar qualidade por performance reduzindo `numvertices`.
     */
    useVertices: boolean;

    /**
     * @param position - Posição do círculo (interpretada conforme `drawMode`).
     * @param conf     - Configuração do círculo. Veja `CircleConfig`.
     * @throws Se `position` não for instância de `Point`.
     */
    constructor(position: Point, conf: CircleConfig) {
        if (!(position instanceof Point)) {
            throw new Error("CircleObject::constructor: position não é instância da classe Point.");
        }

        const numvertices = conf.numvertices ?? 32;
        const angleIncrement = 360 / numvertices;
        const vertices: Point[] = [];
        for (let w = 0; w < 360; w += angleIncrement) {
            vertices.push(new Point(
                position.x + Math.cos(Math.PI / 180 * w) * conf.radius,
                position.y + Math.sin(Math.PI / 180 * w) * conf.radius,
            ));
        }

        super(position, {
            ...conf,
            type: "Circle",
            drawMode: "CENTER",
            color: conf.color ?? new Color(1, 1, 1, 1),
            vertices,
        });

        this.radius = conf.radius ?? 10;
        this.numvertices = numvertices;
        this.useVertices = conf.useVertices ?? false;
    }

    // ─────────────────────────────────────────────
    // Implementações obrigatórias de Shape
    // ─────────────────────────────────────────────

    /**
     * Recalcula os vértices do polígono de aproximação
     * com base na posição e raio atuais.
     * Sempre atualizado antes de cada `draw()`, mesmo quando
     * `useVertices` é `false` — os vértices são usados para colisão.
     */
    updateVertices(): void {
        const angleIncrement = 360 / this.numvertices;
        this.vertices = [];
        for (let w = 0; w < 360; w += angleIncrement) {
            this.vertices.push(new Point(
                this.position.x + Math.cos(Math.PI / 180 * w) * this.radius,
                this.position.y + Math.sin(Math.PI / 180 * w) * this.radius,
            ));
        }
    }

    /**
     * Injeta `radius`, `numvertices` e `useVertices` no conf de clonagem.
     * Chamado por `Shape.clone()` antes de criar a cópia.
     */
    protected _localClone(conf: ShapeConfig): void {
        (conf as CircleConfig).radius = this.radius;
        (conf as CircleConfig).numvertices = this.numvertices;
        (conf as CircleConfig).useVertices = this.useVertices;
    }

    /**
     * Desenha o círculo no canvas.
     *
     * Se `useVertices` for `true`, delega para `drawVertices()` usando
     * o polígono de aproximação — qualidade controlada por `numvertices`.
     * Caso contrário, usa `arc()` para um círculo perfeito.
     *
     * Nota sobre origem:
     * `arc()` usa o centro como origem nativamente. Por isso:
     * - `CENTER` → usa `position` diretamente.
     * - `UPLEFT` → soma o raio para compensar.
     *
     * @param canvas_context - Contexto 2D do canvas.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        this.updateVertices();
        if (!this.visible) return;

        if (this.useVertices) {
            super.drawVertices(canvas_context);
            return;
        }

        canvas_context.save();
        canvas_context.beginPath();

        const center = this.drawMode === "CENTER"
            ? this.position
            : new Point(this.position.x + this.radius, this.position.y + this.radius);

        canvas_context.arc(center.x, center.y, this.radius, 0, MathHelper._TWOPI);

        if (this.color) {
            if (this.color.constructor.name === "GradientColor") {
                canvas_context.globalCompositeOperation = "lighter";
                const gradient = canvas_context.createRadialGradient(
                    this.position.x, this.position.y, 1,
                    this.position.x, this.position.y,
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
import { Color } from "../util/Color.js";
import { Item } from "./Item.js";
import { MathHelper } from "../util/MathHelper.js";

/**
 * TextObject — renders a text string on the canvas.
 *
 * Currently a standalone `Item` subclass (not a `Shape`),
 * so it does not have vertices or drawMode.
 */
export class TextObject extends Item {
    /** Position (x, y) on the canvas. */
    position: any;
    /** Fill colour of the text. */
    color: Color;
    /** Optional stroke colour for outlined text. */
    lineColor?: Color;
    /** Stroke width when `lineColor` is set. */
    lineWidth?: number;
    /** String content to render. */
    text: string;
    /** Font family name (e.g. `"Consolas"`, `"Arial"`). */
    font: string;
    /** Font size in pixels. Default: 14. */
    size: number;
    /** Font weight string (`"bold"` or `""`). */
    bold: string;
    /** Font style string (`"italic"` or `""`). */
    italic: string;
    /** Rotation in degrees. */
    rotation: number;

    /**
     * @param POINT - Position on the canvas.
     * @param CONF - Configuration object or plain text string. If a string, it is used as `text`.
     */
    constructor(POINT: any, CONF: string | Record<string, any>) {
        const isString = typeof CONF === "string";
        const CONFIG: Record<string, any> = {
            type: "Text",
            text: isString ? CONF : CONF.text,
            color: CONF.color ?? new Color(0.5, 0.5, 0.5, 1),
            font: CONF.font ?? "Consolas",
            size: CONF.size ?? 14,
            bold: CONF.bold === true ? "bold" : "",
            italic: CONF.italic ? "italic" : "",
            rotation: CONF.rotation ?? 0,
        };
        super(CONFIG);
        this.position = POINT;
        this.color = CONFIG.color;
        this.lineColor = CONFIG.lineColor;
        this.lineWidth = CONFIG.lineWidth;
        this.text = CONFIG.text;
        this.font = CONFIG.font;
        this.size = CONFIG.size;
        this.bold = CONFIG.bold;
        this.italic = CONFIG.italic;
        this.rotation = CONFIG.rotation;
    }

    /**
     * Sets the font weight to bold if `mode` is `"bold"`.
     * @param mode - Pass `"bold"` to enable bold, any other value is ignored.
     */
    setWeight(mode: string): void {
        if (mode === "bold") {
            this.bold = "bold";
        }
    }

    /**
     * Renders the text string on the canvas.
     * @param canvas_context - Canvas 2D rendering context.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        canvas_context.save();
        if (this.rotation) {
            canvas_context.translate(this.position.x, this.position.y);
            canvas_context.rotate(MathHelper._PI180 * this.rotation);
            canvas_context.translate(-this.position.x, -this.position.y);
        }
        canvas_context.font = `${this.bold} ${this.italic} ${this.size}px ${this.font}`;
        canvas_context.fillStyle = (this.color as any).CSS ?? this.color as any;
        canvas_context.fillText(this.text, this.position.x, this.position.y);
        if (this.lineColor) {
            canvas_context.strokeText(this.text, this.position.x, this.position.y);
        }
        canvas_context.restore();
    }
}

import { Color } from "../util/Color.js";
import { Item } from "./Item.js";

/**
 * TextObject — renders a text string on the canvas.
 *
 * Currently a standalone `Item` subclass (not a `Shape`),
 * so it does not have vertices or drawMode.
 */
export class TextObject extends Item {
    position: any;
    color: Color;
    lineColor?: Color;
    lineWidth?: number;
    text: string;
    font: string;
    size: number;
    bold: string;
    italic: string;

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
    }

    setWeight(mode: string): void {
        if (mode === "bold") {
            this.bold = "bold";
        }
    }

    draw(canvas_context: CanvasRenderingContext2D): void {
        canvas_context.font = `${this.bold} ${this.italic} ${this.size}px ${this.font}`;
        canvas_context.fillStyle = (this.color as any).CSS ?? this.color as any;
        canvas_context.fillText(this.text, this.position.x, this.position.y);
        if (this.lineColor) {
            canvas_context.strokeText(this.text, this.position.x, this.position.y);
        }
    }
}

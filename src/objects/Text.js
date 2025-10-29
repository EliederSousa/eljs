import { Color } from "../util/Color.js";
import { Item } from "../../old/Item.js";

export class TextObject extends Item {
    constructor(POINT, CONF) {
        // Eu posso passar um objeto 'cheio' (com todas as propriedades); 
        // A classe Item não usará todas, só as que são comuns para qualquer
        // objeto (posição, rotação, cores).
        let CONFIG = {
            type: "Text",
            text: typeof (CONF) === "string" ? CONF : CONF.text,
            color: CONF.color ? CONF.color : new Color(.5, .5, .5, 1),
            font: CONF.font ? CONF.font : 'Consolas',
            size: CONF.size ? CONF.size : 14,
            bold: CONF.bold == true ? "bold" : "",
            italic: CONF.italic ? "italic" : "",
        };
        super(POINT, CONFIG);

        // Propriedades existentes apenas no objeto Text
        this.text = CONFIG.text;
        this.font = CONFIG.font;
        this.size = CONFIG.size;
        this.bold = CONFIG.bold;
        this.italic = CONFIG.italic;
    }

    setWeight(mode) {
        if (mode == "bold") {
            this.bold = "bold";
        }
    }

    draw(canvas_context) {
        // TODO: STROKETEXT, ALIGN, STYLES ( ITALIC, BOLD, etc)
        if (this.size && this.font) {
            canvas_context.font = `${this.bold} ${this.italic} ${this.size}px ${this.font}`;
        } else {
            canvas_context.font = "14px Consolas";
        }
        canvas_context.fillStyle = this.color.CSS ? this.color.CSS : this.color;
        canvas_context.fillText(this.text, this.position.x, this.position.y);
        if (this.lineColor) {
            canvas_context.strokeText(this.text, this.position.x, this.position.y);
        };
    }
}
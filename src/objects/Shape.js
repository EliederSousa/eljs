import { Color } from "../util/Color.js";
import { Item } from "./Item.js";

// id, type, timer, creationTime, maxTime, position, type, rotation, visible, color, lineColor, lineWidth, drawMode, vertices
export class Shape extends Item {

    static drawModes = {
        "UPLEFT": "UPLEFT",
        "CENTER": "CENTER",
        "VERTICES": "VERTICES"
    };

    constructor(position, conf) {
        let config = {};
        if (position.constructor.name != "Point") {
            throw new Error("Shape::constructor: position não é instância da classe Point.");
        } else if (typeof conf !== "object") {
            throw new Error("Shape::constructor: o objeto passado para Shape não é válido.");
        } else {
            // Propriedades do Item
            config.type = conf.type || "Shape";
            super(config);

            // Propriedades do Shape
            this.position = position;
            this.rotation = conf.rotation || 0;
            this.visible = conf.visible || true;
            this.color = conf.color || new Color(1, 1, 1, 1);
            this.lineColor = conf.lineColor;
            this.lineWidth = conf.lineWidth;
            if (conf.drawMode in Shape.drawModes) {
                this.drawMode = conf.drawMode;
            } else {
                throw new Error("Shape::constructor: drawMode inválido.");
            }
            if (conf.vertices) {
                this.vertices = conf.vertices;
            } else {
                throw new Error("Shape::constructor: não foi passado um Array de vértices válido.");
            }
        }
    }

    clone(newposition) {
        const conf = {
            type: this.type,
            rotation: this.rotation,
            visible: this.visible,
            color: this.color.clone ? this.color.clone() : this.color,
            lineColor: this.lineColor.clone ? this.lineColor.clone() : this.lineColor,
            lineWidth: this.lineWidth,
            drawMode: this.drawMode,
            vertices: this.vertices.map(v => v.clone())
        };
        const pos = newposition ? newposition.clone() : this.position.clone();
        this._localClone(conf);
        /** @type {any} */
        const ctor = this.constructor;
        return new ctor(pos, conf);

    }

    _localClone(conf) { };

    draw(canvas_context, camera, screen) {
        throw new Error("Shape::draw(): Uma classe filho não implementou a função draw().");
    }

    drawVertices(canvas_context) {
        canvas_context.beginPath();
        canvas_context.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++)
            canvas_context.lineTo(this.vertices[i].x, this.vertices[i].y);
        canvas_context.closePath();

        if (this.color) {
            canvas_context.fillStyle = this.color.CSS ? this.color.CSS : this.color;
            canvas_context.fill();
        }
        if (this.lineColor) {
            canvas_context.strokeStyle = this.lineColor.CSS ? this.lineColor.CSS : this.lineColor;
            canvas_context.lineWidth = this.lineWidth;
            canvas_context.stroke();
        }
    }
}
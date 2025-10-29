import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Shape } from "./Shape.js";

// id, type, timer, creationTime, maxTime, position, type, rotation, visible, color, lineColor, lineWidth, drawMode, vertices, width, height
export class RectangleObject extends Shape {
    constructor(position, conf) {
        let config = {};
        if (position.constructor.name !== "Point") {
            throw new Error("RectangleObject::constructor: position não é instância da classe Point.");
        }
        if (conf.constructor.name === "Number") {
            config.size = conf;
        } else if (typeof conf == "object") {
            config = conf;
        } else throw new Error("Square::constructor: parâmetro inválido.");
        config.type = "Rectangle";
        config.rotation = conf.rotation || 0;
        config.visible = conf.visible || true;
        config.color = conf.color || new Color(1, 1, 1, 1);
        config.lineColor = conf.lineColor;
        config.lineWidth = conf.lineWidth;
        config.drawMode = conf.drawMode || Shape.drawModes.UPLEFT;

        // Calculando vértices. Vértices são sempre calculados pelo centro.
        let halfx = conf.width / 2;
        let halfy = conf.height / 2;
        config.vertices = [
            position.clone().add(-halfx, -halfy),
            position.clone().add(halfx, -halfy),
            position.clone().add(halfx, halfy),
            position.clone().add(-halfx, halfy)
        ];
        super(position, config);
        this.width = conf.width || 10;
        this.height = conf.height || 10;
    }

    _localClone(conf) {
        conf.width = this.width;
        conf.height = this.height;
    }

    /** @override */
    draw(canvas_context) {
        if (!this.visible) return;
        if (this.drawMode == Shape.drawModes.VERTICES) {
            super.drawVertices(canvas_context);
        } else {
            canvas_context.save();
            let temppos;
            if (this.drawMode == Shape.drawModes.CENTER) {
                // TODO:: guardar a metade do tamanho para não calcular toda hora.
                temppos = new Point(this.position.x - this.width / 2, this.position.y - this.height / 2);
            } else {
                temppos = this.position;
            }
            if (this.color) {
                if (this.color) {
                    canvas_context.fillStyle = this.color.CSS ? this.color.CSS : this.color;
                    canvas_context.fillRect(temppos.x, temppos.y, this.width, this.height);
                }
                if (this.lineColor && this.lineWidth) {
                    canvas_context.strokeStyle = this.lineColor.CSS ? this.lineColor.CSS : this.lineColor;
                    canvas_context.lineWidth = this.lineWidth;
                    canvas_context.strokeRect(temppos.x, temppos.y, this.width, this.height);
                }
            }
            canvas_context.restore();
        }
    }
}
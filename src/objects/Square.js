import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Shape } from "./Shape.js";

// id, type, timer, creationTime, maxTime, position, type, rotation, visible, color, lineColor, lineWidth, drawMode, vertices, size
export class SquareObject extends Shape {
    constructor(position, conf) {
        let config = {};
        if (position.constructor.name !== "Point") {
            throw new Error("SquareObject::constructor: position não é instância da classe Point.");
        }
        if (conf.constructor.name === "Number") {
            config.size = conf;
        } else if (typeof conf == "object") {
            config = conf;
        } else throw new Error("Square::constructor: parâmetro inválido.");
        config.type = "Square";
        config.rotation = conf.rotation || 0;
        config.visible = conf.visible || true;
        config.color = conf.color || new Color(1, 1, 1, 1);
        config.lineColor = conf.lineColor;
        config.lineWidth = conf.lineWidth;
        config.drawMode = conf.drawMode || Shape.drawModes.UPLEFT;

        // Calculando vértices. Vértices são sempre calculados pelo centro.
        let half = conf.size / 2;
        config.vertices = [
            position.clone().add(-half, -half),
            position.clone().add(half, -half),
            position.clone().add(half, half),
            position.clone().add(-half, half)
        ];
        super(position, config);
        this.size = conf.size || 10;
    }

    updateVertices() {
        let half = this.size / 2;
        this.vertices = [
            this.position.clone().add(-half, -half),
            this.position.clone().add(half, -half),
            this.position.clone().add(half, half),
            this.position.clone().add(-half, half)
        ];
    }
    // TODO arrumar o update dos vertices para cada Shape

    _localClone(conf) {
        conf.size = this.size;
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
                temppos = new Point(this.position.x - this.size / 2, this.position.y - this.size / 2);
            } else {
                temppos = this.position;
            }
            if (this.color) {
                if (this.color) {
                    canvas_context.fillStyle = this.color.CSS ? this.color.CSS : this.color;
                    canvas_context.fillRect(temppos.x, temppos.y, this.size, this.size);
                }
                if (this.lineColor && this.lineWidth) {
                    canvas_context.strokeStyle = this.lineColor.CSS ? this.lineColor.CSS : this.lineColor;
                    canvas_context.lineWidth = this.lineWidth;
                    canvas_context.strokeRect(temppos.x, temppos.y, this.size, this.size);
                }
            }
            canvas_context.restore();
        }
    }
}
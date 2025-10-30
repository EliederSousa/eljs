import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Shape } from "./Shape.js";

// id, type, timer, creationTime, maxTime, position, type, rotation, visible, color, lineColor, lineWidth, drawMode, vertices, size
export class LineObject extends Shape {
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
        config.type = "Line";
        config.rotation = conf.rotation || 0;
        config.visible = conf.visible || true;
        config.color = conf.color || new Color(1, 1, 1, 1);
        config.lineColor = conf.lineColor;
        config.lineWidth = conf.lineWidth;
        config.drawMode = conf.drawMode || Shape.drawModes.UPLEFT;

        config.vertices = [
            position.clone(),
            conf.to.clone()
        ];

        super(position, config);
        this.to = conf.to;
    }

    _localClone(conf) {
        conf.to = this.to;
    }

    /** @override */
    draw(canvas_context) {
        if (!this.visible) return;
        if (this.drawMode == Shape.drawModes.VERTICES) {
            super.drawVertices(canvas_context);
        } else {
            canvas_context.save();
            let temppos;
            let tempwidth;
            let tempheight;
            if (this.drawMode == Shape.drawModes.CENTER) {
                tempwidth = this.to.x - this.position.x;
                tempheight = this.to.y - this.position.y;
                temppos = new Point(this.position.x - tempwidth / 2, this.position.y - tempheight / 2);
            } else {
                temppos = this.position;
                tempwidth = this.to.x - this.position.x;
                tempheight = this.to.y - this.position.y;
            }
            if (this.color) {
                if (this.color) {
                    canvas_context.fillStyle = this.color.CSS ? this.color.CSS : this.color;
                }
                if (this.lineColor && this.lineWidth) {
                    canvas_context.strokeStyle = this.lineColor.CSS ? this.lineColor.CSS : this.lineColor;
                    canvas_context.lineWidth = this.lineWidth;
                }
            }
            canvas_context.beginPath();
            canvas_context.moveTo(temppos.x, temppos.y);
            canvas_context.lineTo(temppos.x + tempwidth, temppos.y + tempheight);
            canvas_context.closePath();
            canvas_context.stroke();
            canvas_context.restore();
        }
    }
}
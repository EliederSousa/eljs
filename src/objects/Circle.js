import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { MathHelper } from "../util/MathHelper.js";
import { Shape } from "./Shape.js";

// id, type, timer, creationTime, maxTime, position, type, rotation, visible, color, lineColor, lineWidth, drawMode, vertices, radius
export class CircleObject extends Shape {
    constructor(position, conf) {
        let config = {};
        if (position.constructor.name !== "Point") {
            throw new Error("CircleObject::constructor: position não é instância da classe Point.");
        }
        if (conf.constructor.name === "Number") {
            config.size = conf;
        } else if (typeof conf == "object") {
            config = conf;
        } else throw new Error("Circle::constructor: parâmetro inválido.");
        config.type = "Circle";
        config.rotation = conf.rotation || 0;
        config.visible = conf.visible || true;
        config.color = conf.color || new Color(1, 1, 1, 1);
        config.lineColor = conf.lineColor;
        config.lineWidth = conf.lineWidth;
        config.drawMode = conf.drawMode || Shape.drawModes.UPLEFT;

        // Calculando vértices. Vértices são sempre calculados pelo centro.
        let numvertices = conf.numvertices || 32;
        let angleincrement = 360 / numvertices;
        config.vertices = [];
        for (let w = 0; w < 360; w += angleincrement) {
            let temp = position.clone();
            config.vertices.push(new Point(temp.x + (Math.cos(Math.PI / 180 * w) * conf.radius), temp.y + (Math.sin(Math.PI / 180 * w) * conf.radius)));
        }
        super(position, config);
        this.radius = conf.radius || 10;
        this.numvertices = conf.numvertices || 32;
    }

    _localClone(conf) {
        conf.radius = this.radius;
        conf.numvertices = this.numvertices;
    }

    updateVertices() {
        let numvertices = this.numvertices || 32;
        let angleincrement = 360 / numvertices;
        this.vertices = [];
        for (let w = 0; w < 360; w += angleincrement) {
            let temp = this.position.clone();
            this.vertices.push(new Point(temp.x + (Math.cos(Math.PI / 180 * w) * this.radius), temp.y + (Math.sin(Math.PI / 180 * w) * this.radius)));
        }
    }

    /** @override */
    draw(canvas_context) {
        this.updateVertices();
        if (!this.visible) return;
        if (this.drawMode == Shape.drawModes.VERTICES) {
            super.drawVertices(canvas_context);
        } else {
            canvas_context.save();
            canvas_context.beginPath();
            let temppos;
            // Círculos ja são desenhados com origem em seu centro.
            // Infelizmente é uma inconsistência que temos que tratar invertendo a lógica de como seria com Square ou Rectangle, onde desenhamos o retângulo usando o canto superior esquerdo como centro, e removemos metade do tamanho para normalizar para o centro.
            if (this.drawMode == Shape.drawModes.CENTER) {
                temppos = this.position;
            } else {
                temppos = new Point(this.position.x + this.radius, this.position.y + this.radius);
            }
            canvas_context.arc(temppos.x, temppos.y, this.radius, 0, MathHelper._TWOPI);
            if (this.color) {
                if (this.color.constructor.name == "GradientColor") {
                    canvas_context.globalCompositeOperation = "lighter";
                    let gradient = canvas_context.createRadialGradient(this.position.x, this.position.y, 1, this.position.x, this.position.y, this.radius - this.color.radiusOffset);
                    this.color.colors.map((color, step) => {
                        gradient.addColorStop(step / (this.color.colors.length - 1), color.CSS);
                    })
                    canvas_context.fillStyle = gradient;
                } else {
                    canvas_context.fillStyle = this.color.CSS ? this.color.CSS : this.color;
                }
                canvas_context.fill();
                if (this.lineColor && this.lineWidth) {
                    canvas_context.strokeStyle = this.lineColor.CSS ? this.lineColor.CSS : this.lineColor;
                    canvas_context.lineWidth = this.lineWidth;
                    canvas_context.stroke();
                }
            }
            canvas_context.restore();
        }
    }
}
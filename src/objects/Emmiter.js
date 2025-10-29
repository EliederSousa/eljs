import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Timer } from "../util/Timer.js";
import { Circle } from "../../old/Circle.js";
import { TextObject } from "./Text.js";
import { MathHelper } from "../util/MathHelper.js";

/**
 * EmmiterManager
 * 
 * Gerencia a emissão periódica de objetos (como partículas),
 * em uma área circular definida por `position` e `radius`.
 * 
 * Cada emissor pode:
 *  - Criar instâncias de um objeto base (`particle`)
 *  - Sortear um tempo aleatório entre `minTime` e `maxTime`
 *  - Exibir um contador visual opcional
 */
export class EmmiterManager {
    constructor(config) {
        this.position = config.position.clone();
        this.radius = config.radius || 50;
        this.minTime = config.minTime || 1000;
        this.maxTime = config.maxTime || 2000;
        this.nextCreationTime = this.minTime;
        this.timer = new Timer();
        this.color = config.color || new Color(Math.random(), Math.random(), Math.random(), 0.2);

        this.particle = config.particle;

        // Elementos visuais
        this.shape = new Circle(this.position.clone(), {
            color: this.color,
            mode: "center",
            radius: this.radius,
        });

        const textPos = this.position.clone();
        textPos.sub(new Point(12, this.radius - 12));
        this.textShape = new TextObject(textPos, {
            color: new Color(Color.colors.W3C.silver),
            text: "",
            bold: true,
            size: 12,
            font: "Courier New",
        });
    }

    /** Verifica se está na hora de criar um novo objeto */
    isReadyToCreate() {
        this.update();
        if (this.timer.compare() > this.nextCreationTime) {
            this.timer.update();
            this.nextCreationTime = MathHelper.randomBetween(this.minTime, this.maxTime);
            return true;
        }
        return false;
    }

    /** Cria um novo objeto baseado na partícula original */
    create() {
        const pos = MathHelper.randomInsideCircle(this.position, this.radius);
        return pos
    }

    /** Atualiza o contador interno */
    update() {
        const remaining = (this.nextCreationTime - this.timer.compare()) / 1000;
        this.textShape.text = remaining.toFixed(1);
    }

    /** Desenha o emissor e o contador */
    draw(context) {
        this.shape.draw(context);
        this.textShape.draw(context);
    }
}

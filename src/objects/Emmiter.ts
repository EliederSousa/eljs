import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Timer } from "../util/Timer.js";
import { CircleObject } from "./Circle.js";
import { TextObject } from "./Text.js";
import { MathHelper } from "../util/MathHelper.js";

/**
 * EmmiterManager — manages periodic emission of objects (particles)
 * within a circular area.
 */
export class EmmiterManager {
    position: Point;
    radius: number;
    minTime: number;
    maxTime: number;
    nextCreationTime: number;
    timer: Timer;
    color: Color;
    particle: any;
    shape: CircleObject;
    textShape: TextObject;

    constructor(config: Record<string, any>) {
        this.position = config.position.clone();
        this.radius = config.radius || 50;
        this.minTime = config.minTime || 1000;
        this.maxTime = config.maxTime || 2000;
        this.nextCreationTime = this.minTime;
        this.timer = new Timer();
        this.color = config.color || new Color(Math.random(), Math.random(), Math.random(), 0.2);

        this.particle = config.particle;

        this.shape = new CircleObject(this.position.clone(), {
            color: this.color,
            drawMode: "CENTER",
            radius: this.radius,
        });

        const textPos = this.position.clone();
        textPos.sub(new Point(12, this.radius - 12));
        this.textShape = new TextObject(textPos, {
            color: new Color(Color.colors.W3C.silver as unknown as number[]),
            text: "",
            bold: true,
            size: 12,
            font: "Courier New",
        });
    }

    /** Returns `true` when it's time to create a new object. */
    isReadyToCreate(): boolean {
        this.update();
        if (this.timer.compare() > this.nextCreationTime) {
            this.timer.update();
            this.nextCreationTime = MathHelper.randomBetween(this.minTime, this.maxTime);
            return true;
        }
        return false;
    }

    /** Creates a new object cloned from the base particle at a random position. */
    create(): any {
        const pos = MathHelper.randomInsideCircle(this.position, this.radius);
        return this.particle.clone(pos);
    }

    /** Updates the visual timer countdown. */
    update(): void {
        const remaining = (this.nextCreationTime - this.timer.compare()) / 1000;
        this.textShape.text = remaining.toFixed(1);
    }

    /** Draws the emitter area and its countdown text. */
    draw(context: CanvasRenderingContext2D): void {
        this.shape.draw(context);
        this.textShape.draw(context);
    }
}

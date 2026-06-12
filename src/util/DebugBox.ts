import { Mouse } from "../input/Mouse.js";
import { Keyboard } from "../input/Keyboard.js";
import { Item } from "../objects/Item.js";
import { RectangleObject } from "../objects/Rectangle.js";
import { TextObject } from "../objects/Text.js";
import { Point } from "../physics/Point.js";
import { Color } from "./Color.js";
import { ObjectContainer } from "./ObjectContainer.js";

/**
 * Debug overlay that displays FPS, mouse coords, key states,
 * and object count on screen.
 */
export class DebugBox extends Item {
    position: Point;
    boxLines: number;
    box: RectangleObject;
    objectContainer: ObjectContainer<any> | string;
    versionText: TextObject;
    mouseText: TextObject;
    booleanText: TextObject;
    lastFrameTime: number;
    frameCount: number;
    fps: number;
    lastFpsUpdate: number;
    width: number;
    height: number;


    constructor(POINT = new Point(5, 5), CONF: { container?: ObjectContainer<any> }) {
        const CONFIG = { type: "DebugBox" };
        super(CONFIG);
        this.position = POINT;
        this.boxLines = 6;
        this.width = 150;
        this.height = 15 * this.boxLines + 20;
        this.box = new RectangleObject(new Point(this.width / 2, this.height / 2 + 8), {
            color: new Color(0, 0, 0, 0),
            lineColor: new Color(Color.colors.green as unknown as number[]),
            lineWidth: 1,
            width: this.position.x + 140,
            height: this.height,
        });
        this.objectContainer = CONF.container ? CONF.container : "null";

        this.versionText = new TextObject(new Point(0, 0), {
            text: "",
            color: new Color(Color.colors.tomato as unknown as number[]),
            font: "Courier New",
            size: 13,
            bold: true,
        });

        this.mouseText = new TextObject(new Point(0, 0), {
            text: "",
            color: new Color(Color.colors.white as unknown as number[]),
            font: "Courier New",
            size: 12,
            bold: true,
        });

        this.booleanText = new TextObject(new Point(0, 0), {
            text: "",
            color: new Color(Color.colors.silver as unknown as number[]),
            font: "Courier New",
            size: 12,
            bold: true,
        });

        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = performance.now();
    }

    updateFps(): void {
        const now = performance.now();

        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;

        if (delta > 0) {
            const currentFps = 1000 / delta;
            this.fps = Math.round(this.fps * 0.9 + currentFps * 0.1);
        }
    }

    setPosition(X: number, Y: number): void {
        this.position.x = X;
        this.position.y = Y;
    }

    draw(canvas_context: CanvasRenderingContext2D, camera: any, screen: any): void {
        this.updateFps();
        let xTemp = this.position.x + 5;
        let yTemp = this.position.y + 15;
        this.versionText.position = new Point(xTemp, yTemp);
        this.versionText.text = "  SANDBOX v1.1";
        screen.drawItem(this.versionText);

        this.mouseText.position = new Point(xTemp, yTemp += 15);
        this.mouseText.text = `FPS: ${this.fps}`;
        screen.drawItem(this.mouseText);

        this.mouseText.position = new Point(xTemp, yTemp += 15);
        this.mouseText.text = "Mouse: " + Mouse.x + ", " + Mouse.y;
        screen.drawItem(this.mouseText);

        this.mouseText.position = new Point(xTemp, yTemp += 15);
        this.mouseText.text = "Clicked?";
        screen.drawItem(this.mouseText);

        this.booleanText.position = new Point(xTemp + 30 + screen.measureText(this.mouseText.text).width, yTemp);
        this.booleanText.text = "" + Mouse.isDown;
        this.booleanText.color = Mouse.isDown ? new Color(Color.colors.lime as unknown as number[]) : new Color(Color.colors.red_wine as unknown as number[]);
        screen.drawItem(this.booleanText);

        this.mouseText.position = new Point(xTemp, yTemp += 15);
        this.mouseText.text = "SHIFT:";
        screen.drawItem(this.mouseText);

        this.booleanText.position = new Point(xTemp + 20 + screen.measureText(this.mouseText.text).width, yTemp);
        this.booleanText.text = "" + Keyboard.isDown(Keyboard.SHIFTLEFT);
        this.booleanText.color = Keyboard.isDown(Keyboard.SHIFTLEFT) ? new Color(Color.colors.lime as unknown as number[]) : new Color(Color.colors.red_wine as unknown as number[]);
        screen.drawItem(this.booleanText);

        this.mouseText.position = new Point(xTemp, yTemp += 15);
        this.mouseText.text = "CONTROL:";
        screen.drawItem(this.mouseText);

        this.booleanText.position = new Point(xTemp + 15 + screen.measureText(this.mouseText.text).width, yTemp);
        this.booleanText.text = "" + Keyboard.isDown(Keyboard.CONTROLLEFT);
        this.booleanText.color = Keyboard.isDown(Keyboard.CONTROLLEFT) ? new Color(Color.colors.lime as unknown as number[]) : new Color(Color.colors.red_wine as unknown as number[]);
        screen.drawItem(this.booleanText);

        this.mouseText.position = new Point(xTemp, yTemp += 15);
        this.mouseText.text = "Objects: " + (typeof this.objectContainer === "string" ? this.objectContainer : this.objectContainer.getCount());
        screen.drawItem(this.mouseText);

        //this.box.position = new Point(this.position.x, this.position.y);
        screen.drawItem(this.box);
    }
}

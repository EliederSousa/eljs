import { Mouse } from "../input/Mouse.js";
import { Keyboard } from "../input/Keyboard.js";
import { Item } from "../objects/Item.js";
import { RectangleObject } from "../objects/Rectangle.js";
import { TextObject } from "../objects/Text.js";
import { Point } from "../physics/Point.js";
import { Color } from "./Color.js";
import { ObjectContainer } from "./ObjectContainer.js";

export class DebugBox extends Item {
    constructor(POINT = new Point(5, 5), CONF) {
        let CONFIG = { type: "DebuxBox", };
        super(CONFIG);
        this.position = POINT;
        this.boxLines = 6;
        this.box = new RectangleObject(new Point(this.position.x, this.position.y), {
            color: new Color(0, 0, 0, 0),
            lineColor: new Color(Color.colors.green),
            lineWidth: 1,
            width: this.position.x + 140,
            height: this.position.y + 15 * this.boxLines + 14,
        });
        this.objectContainer = CONF.container ? CONF.container : "null";

        this.versionText = new TextObject(new Point(0, 0), {
            text: "",
            color: new Color(Color.colors.tomato),
            font: 'Courier New',
            size: 13,
            bold: true
        });

        this.mouseText = new TextObject(new Point(0, 0), {
            text: "",
            color: new Color(Color.colors.white),
            font: 'Courier New',
            size: 12,
            bold: true
        });

        this.booleanText = new TextObject(new Point(0, 0), {
            text: "",
            color: new Color(Color.colors.silver),
            font: 'Courier New',
            size: 12,
            bold: true,
        });

        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = performance.now();
    };

    updateFps() {
        const now = performance.now();
        this.frameCount++;
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
            this.lastFpsUpdate = now;
            this.frameCount = 0;
        }
        this.lastFrameTime = now;
    }

    setPosition(X, Y) {
        this.position.x = X;
        this.position.y = Y;
    }

    draw(canvas_context, camera, screen) {
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
        this.booleanText.color = Mouse.isDown ? new Color(Color.colors.lime) : new Color(Color.colors.red_wine);
        screen.drawItem(this.booleanText);

        this.mouseText.position = new Point(xTemp, yTemp += 15)
        this.mouseText.text = "SHIFT:";
        screen.drawItem(this.mouseText);

        this.booleanText.position = new Point(xTemp + 20 + screen.measureText(this.mouseText.text).width, yTemp);
        this.booleanText.text = "" + Keyboard.isDown(Keyboard.SHIFTLEFT);
        this.booleanText.color = Keyboard.isDown(Keyboard.SHIFTLEFT) ? new Color(Color.colors.lime) : new Color(Color.colors.red_wine);
        screen.drawItem(this.booleanText);

        this.mouseText.position = new Point(xTemp, yTemp += 15)
        this.mouseText.text = "CONTROL:";
        screen.drawItem(this.mouseText);

        this.booleanText.position = new Point(xTemp + 15 + screen.measureText(this.mouseText.text).width, yTemp);
        this.booleanText.text = "" + Keyboard.isDown(Keyboard.CONTROLLEFT);
        this.booleanText.color = Keyboard.isDown(Keyboard.CONTROLLEFT) ? new Color(Color.colors.lime) : new Color(Color.colors.red_wine);
        screen.drawItem(this.booleanText);

        this.mouseText.position = new Point(xTemp, yTemp += 15);
        this.mouseText.text = "Objects: " + (typeof this.objectContainer === "string" ? this.objectContainer : this.objectContainer.getCount());
        screen.drawItem(this.mouseText);

        this.box.position = new Point(this.position.x, this.position.y);
        screen.drawItem(this.box);
    };
}
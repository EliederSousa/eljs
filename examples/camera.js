import { Screen } from "../src/core/Screen.js";
import { Keyboard } from "../src/input/Keyboard.js";
import { Camera } from "../src/objects/Camera.js";
import { Rectangle } from "../old/Rectangle.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";
import { Mouse } from "../src/input/Mouse.js";

const screen = new Screen("fullscreen");
const camera = new Camera(new Point(0, 0), { zoom: 1 });
const rect = new Rectangle(new Point(0, 0), new Point(30, 40));
rect.color = new Color(0.1, 0.6, 0.9, 1);
rect.lineColor = "white";
rect.lineWidth = 2;

function loop() {
    camera.moveSmoothTo(new Point(screen.width / 2 - Mouse.x, screen.height / 2 - Mouse.y));
    if (Keyboard.isDown(Keyboard.NUM7)) camera.zoom += .05;
    if (Keyboard.isDown(Keyboard.NUM9)) camera.zoom -= .05;
    screen.draw();
    camera.update(Camera.easing.easeOutBack);
    screen.drawItem(rect, camera);
    requestAnimationFrame(loop);
}

loop();
/**
 * Camera example — demonstrates camera movement following the mouse
 * and zoom control via numpad keys.
 *
 * Controls:
 * - Move mouse → camera follows
 * - Numpad 7  → zoom in
 * - Numpad 9  → zoom out
 */
import { Screen } from "../src/core/Screen.js";
import { Keyboard } from "../src/input/Keyboard.js";
import { Camera } from "../src/objects/Camera.js";
import { RectangleObject } from "../src/objects/Rectangle.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";
import { Mouse } from "../src/input/Mouse.js";

const screen = new Screen("fullscreen");
const camera = new Camera(new Point(0, 0), { zoom: 1 });
const rect = new RectangleObject(new Point(0, 0), {
    width: 30,
    height: 40,
    color: new Color(0.1, 0.6, 0.9, 1),
    lineColor: new Color(1, 1, 1, 1),
    lineWidth: 2,
});

function loop(): void {
    camera.moveSmoothTo(new Point(screen.width / 2 - Mouse.x, screen.height / 2 - Mouse.y));
    if (Keyboard.isDown(Keyboard.NUM7)) camera.zoom += 0.05;
    if (Keyboard.isDown(Keyboard.NUM9)) camera.zoom -= 0.05;
    screen.draw();
    camera.update(Camera.easing.easeInCubic);
    screen.drawItem(rect, camera);
    requestAnimationFrame(loop);
}

loop();

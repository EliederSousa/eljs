import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";
import { Screen } from "./core/Screen.js";
import { Shape } from "./objects/Shape.js";
import { RectangleObject } from "./objects/Rectangle.js";
import { CircleObject } from "./objects/Circle.js";
import { Keyboard } from "./input/Keyboard.js";
import { Camera } from "./objects/Camera.js";


let scr = new Screen("fullscreen");
let cam = new Camera(new Point(0, 0));
let sq = new CircleObject(new Point(100, 100), {
    color: new Color(Color.colors.W3C.wheat),
    radius: 20,
    drawMode: Shape.drawModes.VERTICES
});
cam.position = sq.position;

function loop() {
    if (Keyboard.isDown(Keyboard.NUM7)) cam.decreaseZoom(.05);
    if (Keyboard.isDown(Keyboard.NUM9)) cam.increaseZoom(.05);
    scr.draw();
    scr.drawItem(sq);
    requestAnimationFrame(loop);
}
loop();
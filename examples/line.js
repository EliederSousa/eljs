import { Screen } from "../src/core/Screen.js";
import { LineObject } from "../src/objects/Line.js";
import { Shape } from "../src/objects/Shape.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";

let sc = new Screen("fullscreen");
let line = new LineObject(new Point(10, 10), {
    to: new Point(100, 50),
    lineColor: new Color(Color.colors.red),
    lineWidth: 2,
    drawMode: Shape.drawModes.VERTICES
});

function loop() {
    sc.draw();
    sc.drawItem(line);
    requestAnimationFrame(loop);
}

loop()
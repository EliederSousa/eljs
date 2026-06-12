/**
 * Line example — draws a single line segment using the `VERTICES`
 * draw mode on a full-screen canvas.
 */
import { Screen } from "../src/core/Screen.js";
import { LineObject } from "../src/objects/Line.js";
import { Shape } from "../src/objects/Shape.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";

const screen = new Screen("fullscreen");
const line = new LineObject(new Point(10, 10), {
    to: new Point(100, 50),
    lineColor: new Color(Color.colors.red),
    lineWidth: 2,
    drawMode: Shape.drawModes.VERTICES,
});

function loop(): void {
    screen.draw();
    screen.drawItem(line);
    requestAnimationFrame(loop);
}

loop();

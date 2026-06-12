/**
 * DebugBox example — displays the FPS, mouse coordinates, key states,
 * and object count overlay.
 *
 * One random object is added to the container every second so the
 * object counter in the DebugBox increments visibly.
 */
import { Screen } from "../src/core/Screen.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";
import { DebugBox } from "../src/util/DebugBox.js";
import { ObjectContainer } from "../src/util/ObjectContainer.js";
import { Timer } from "../src/util/Timer.js";


const screen = new Screen("fullscreen");
screen.setBackgroundColor(new Color(0, 0, 0, 1));
const obj = new ObjectContainer();
const box = new DebugBox(new Point(5, 5), { container: obj });
const timer = new Timer();

function loop(): void {
    if (timer.compare() > 1000) {
        timer.update();
        obj.add(Math.random());
    }
    screen.draw();
    screen.drawItem(box);
    requestAnimationFrame(loop);
}

loop();

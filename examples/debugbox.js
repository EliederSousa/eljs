import { Screen } from "../src/core/Screen.js";
import { Point } from "../src/physics/Point.js";
import { Color } from "../src/util/Color.js";
import { DebugBox } from "../src/util/DebugBox.js";
import { ObjectContainer } from "../src/util/ObjectContainer.js";
import { Timer } from "../src/util/Timer.js";


const screen = new Screen("fullscreen");
screen.setBackgroundColor(new Color(0,0,0,1));
const obj = new ObjectContainer();
const box = new DebugBox(new Point(5, 5), {container: obj});
const timer = new Timer();

function loop() {
    // Adiciona um objeto por segundo no container, apenas para demonstrar o DebugBox contando.
    if( timer.compare() > 1000 ) {
        timer.update();
        obj.add(Math.random());
    }
    screen.draw();
    screen.drawItem(box);
    requestAnimationFrame(loop);
}

loop();
/**
 * Timer example — prints the elapsed time every 2 seconds.
 *
 * Creates a Timer, logs the time since script start every
 * 2 seconds using `compare()` / `update()`.
 *
 * Open the browser DevTools console to see the output.
 */
import { Timer } from "../src/util/Timer.js";

const timer = new Timer();
const startingTime = timer.now();

function loop(): void {
    if (timer.compare() > 2000) {
        timer.update();
        console.log(timer.now() - startingTime);
    }
    requestAnimationFrame(loop);
}

loop();

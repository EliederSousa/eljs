import { Screen } from "./core/Screen.js";
import { Keyboard } from "./input/Keyboard.js";
import { Mouse } from "./input/Mouse.js";
import { MovableObject } from "./objects/MovableObject.js";
import { Shape } from "./objects/Shape.js";
import { SquareObject } from "./objects/Square.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";

let sc = new Screen("fullscreen");
let sq = new SquareObject(new Point(20, 20), {
    color: new Color(Color.colors.acid_green),
    size: 20,
    drawMode: Shape.drawModes.VERTICES
})
let mov = new MovableObject(new Point(10, 10), {
    shape: sq,
    velocity: new Point(5, 0),
})

function loop() {
    if (Keyboard.isDown(Keyboard.UP)) mov.applyForce(new Point(0, -.2));
    if (Keyboard.isDown(Keyboard.DOWN)) mov.applyForce(new Point(0, .2));
    if (Keyboard.isDown(Keyboard.LEFT)) mov.applyForce(new Point(-.2, 0));
    if (Keyboard.isDown(Keyboard.RIGHT)) mov.applyForce(new Point(.2, 0));
    //mov.applyForce(new Point(0, 2));
    mov.update();

    sc.draw();
    sc.drawItem(mov);
    requestAnimationFrame(loop);
}

loop();

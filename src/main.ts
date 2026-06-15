import { SquareObject } from "./objects/Square.js";
import { RectangleObject } from "./objects/Rectangle.js";
import { RigidBody } from "./objects/RigidBody.js";
import { World } from "./objects/World.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";
import { Character } from "./objects/Character.js";
import { Keyboard } from "./input/Keyboard.js";
import { Mouse } from "./input/Mouse.js";

let w = new World();
w.screen.setBackgroundColor(Color.fromName("black"));
let character = new Character(100, 200);
w.add(character.body)

const SQUARE_SIZE = 50;
const FLOOR_Y = w.screen.height - 30;
const FLOOR_SURFACE = FLOOR_Y - 5;
const ROWS = 7;

for (let row = 0; row < ROWS; row++) {
    const count = ROWS - row;
    const totalWidth = count * SQUARE_SIZE;
    const startX = w.screen.width / 2 - totalWidth / 2 + SQUARE_SIZE / 2;
    const y = FLOOR_SURFACE - SQUARE_SIZE / 2 - row * SQUARE_SIZE;

    for (let col = 0; col < count; col++) {
        const x = startX + col * SQUARE_SIZE;
        w.add(new RigidBody({
            shape: new SquareObject(new Point(x, y), {
                size: SQUARE_SIZE,
                lineColor: new Color(Color.colors.orange_salmon),
                lineWidth: 1,
            }),
            friction: .5,
            velocity: new Point(0, 0),
            mass: 1,
        }));
    }
}

w.add(new RigidBody({
    shape: new RectangleObject(new Point(w.screen.width / 2, FLOOR_Y), {
        width: w.screen.width,
        height: 10,
        color: Color.fromName("white"),
    }),
    velocity: new Point(0, 0),
    friction: 0,
    mass: Infinity,
    isStatic: true,
}));

let wasClicked = false;
let wasSpaceDown = false;
w.registerMainFunction(() => {
    character.update();
    if (Keyboard.isDown(Keyboard.SPACE) && !wasSpaceDown) {
        let proj = character.shoot();
        w.add(proj);
    }
    wasSpaceDown = Keyboard.isDown(Keyboard.SPACE);
});

w.run();
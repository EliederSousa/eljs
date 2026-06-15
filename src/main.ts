import { Properties } from "./core/Properties";
import { CircleObject } from "./objects/Circle";
import { SquareObject } from "./objects/Square";
import { RectangleObject } from "./objects/Rectangle";
import { RigidBody } from "./objects/RigidBody";
import { World } from "./objects/World";
import { Point } from "./physics/Point";
import { Color } from "./util/Color";
import { Mouse } from "./input/Mouse";
import { Keyboard } from "./input/Keyboard";

class Character {
    body: RigidBody;
    dir: number = 1;

    constructor(x: number, y: number) {
        this.body = new RigidBody({
            shape: new RectangleObject(new Point(x, y), {
                width: 28,
                height: 40,
                color: Color.fromName("dodgerblue"),
                lineColor: Color.fromName("white"),
                lineWidth: 1,
            }),
            velocity: new Point(0, 0),
            mass: 5,
        });
    }

    update(): void {
        let vx = 0;
        if (Keyboard.isDown(Keyboard.KEY_D)) { vx = 250; this.dir = 1; }
        if (Keyboard.isDown(Keyboard.KEY_A)) { vx = -250; this.dir = -1; }
        this.body.movableObject.velocity.x = vx;

        if (Keyboard.isDown(Keyboard.KEY_W)) {
            this.body.movableObject.velocity.y = -250;
        }
    }

    shoot(): RigidBody {
        const pos = this.body.shape.position.clone();
        pos.x += this.dir * 25;
        return new RigidBody({
            shape: new CircleObject(pos, {
                radius: 5,
                color: Color.fromName("yellow"),
                maxTime: 1000,
            }),
            velocity: new Point(this.dir * 3000, 0),
            mass: 1,
        });
    }
}


let w = new World();
w.screen.setBackgroundColor(Color.fromName("black"));

const SQUARE_SIZE = 40;
let column: RigidBody[] = [];
for (let i = 0; i < 5; i++) {
    const x = 500
    const y = w.screen.height - 300 - SQUARE_SIZE / 2 - i * SQUARE_SIZE;
    column.push(new RigidBody({
        shape: new SquareObject(new Point(x, y), {
            size: SQUARE_SIZE,
            lineColor: new Color(Color.colors.orange_salmon),
            lineWidth: 1,
        }),
        velocity: new Point(0, 0),
        mass: 10
    }));
}

let floor = new RigidBody({
    shape: new RectangleObject(new Point(w.screen.width/2, w.screen.height-30), {
        width: w.screen.width,
        height: 10,
        color: Color.fromName("white"),
    }),
    velocity: new Point(0, 0),
    mass: Infinity,
    isStatic: true
})


let character = new Character(100, 200);
let bodies = [...column, character.body];

column.forEach(s => w.add(s));
w.add(floor);
w.add(character.body);
//w.add(floor2);
//w.add(floor3);

let wasClicked = false;
let wasSpaceDown = false;
w.registerMainFunction(() => {
    if (Mouse.isDown && !wasClicked) {
        const origin = new Point(Mouse.x, Mouse.y);
        const radius = 40;
        const force = 99999;
        for (const body of bodies) {
            if (body.movableObject.mass === Infinity) continue;
            const dist = body.shape.position.distanceTo(origin);
            if (dist < radius) {
                const dir = body.shape.position.clone().sub(origin).normal();
                const strength = force * (1 - dist / radius);
                body.applyForce(dir.scale(strength));
            }
        }
    }
    wasClicked = Mouse.isDown;

    character.update();

    if (Keyboard.isDown(Keyboard.SPACE) && !wasSpaceDown) {
        let proj = character.shoot();
        bodies.push(proj);
        w.add(proj);
    }
    wasSpaceDown = Keyboard.isDown(Keyboard.SPACE);
});

w.run();
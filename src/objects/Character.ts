import { Keyboard } from "../input/Keyboard";
import { Point } from "../physics/Point";
import { Color } from "../util/Color";
import { CircleObject } from "./Circle";
import { RectangleObject } from "./Rectangle";
import { RigidBody } from "./RigidBody";

export class Character {
    body: RigidBody;
    dir: number = 1;

    constructor(x: number, y: number) {
        this.body = new RigidBody({
            shape: new RectangleObject(new Point(x, y), {
                width: 28,
                height: 40,
                lineColor: Color.fromName("dodgerblue"),
                lineWidth: 1,
            }),
            velocity: new Point(0, 0),
            mass: 20,
            fixedRotation: true
        });
    }

    update(): void {
        const moveForce = 20; // O quanto ele acelera por frame
        const maxSpeed = 250; // Limite máximo de velocidade para não correr infinitamente

        // 1. Aplica força direcional em vez de cravar a velocidade
        if (Keyboard.isDown(Keyboard.KEY_D)) {
            this.body.movableObject.velocity.x += moveForce;
            this.dir = 1;
        }
        if (Keyboard.isDown(Keyboard.KEY_A)) {
            this.body.movableObject.velocity.x -= moveForce;
            this.dir = -1;
        }

        // 2. Limita a velocidade máxima horizontal
        if (this.body.movableObject.velocity.x > maxSpeed) {
            this.body.movableObject.velocity.x = maxSpeed;
        } else if (this.body.movableObject.velocity.x < -maxSpeed) {
            this.body.movableObject.velocity.x = -maxSpeed;
        }

        // 3. Pulo (com uma trava simples para só pular se não estiver caindo rápido)
        if (Keyboard.isDown(Keyboard.KEY_W)) {
            // Verifica se a velocidade y está próxima de zero (indicando que está no chão)
            if (Math.abs(this.body.movableObject.velocity.y) < 10) {
                this.body.movableObject.velocity.y = -550; // Força do pulo
            }
        }
    }

    shoot(): RigidBody {
        const pos = this.body.shape.position.clone();
        pos.x += this.dir * 25;
        return new RigidBody({
            shape: new CircleObject(pos, {
                radius: 4,
                lineColor: Color.fromName("yellow"),
                lineWidth: 1,
                maxTime: 2000,
            }),
            velocity: new Point(this.dir * 90000, 0),
            mass: 50,
        });
    }
}
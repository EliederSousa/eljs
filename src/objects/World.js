import { ObjectContainer } from "../util/ObjectContainer.js";
import { Screen } from "../core/Screen.js";
import { Camera } from "./Camera.js";
import { Keyboard } from "../input/Keyboard.js";
import { Color } from "../util/Color.js";
import { Point } from "../physics/Point.js";
import { Timer } from "../util/Timer.js";
import { DebugBox } from "../util/DebugBox.js";
import { EmmiterManager } from "./Emmiter.js";
import { Properties } from "../core/Properties.js";

export class World {
    #emmiters;
    #objects;
    #screen;
    #camera;
    #timer;
    #debugbox;
    #mainfunction;
    // #physicsSolver;

    constructor() {
        this.#emmiters = new ObjectContainer();
        this.#objects = new ObjectContainer();
        this.#screen = new Screen("fullscreen");
        this.#screen.setBackgroundColor(new Color(.2));
        this.#camera = new Camera(new Point(this.#screen.center.x, this.#screen.center.y));
        this.#debugbox = new DebugBox(new Point(5, 5), { container: this.#objects });
        // this.#phisicsSolver = new Physics();
        this.#timer = new Timer();
        this.#mainfunction = null;
    }

    registerMainFunction(func) {
        this.#mainfunction = func;
    }

    add(item) {
        this.#objects.add(item);
    }

    addEmitter(conf) {
        this.#emmiters.add(new EmmiterManager(conf));
    }

    run() {
        if (Keyboard.isDown(Keyboard.NUM7)) this.#camera.decreaseZoom(.05);
        if (Keyboard.isDown(Keyboard.NUM9)) this.#camera.increaseZoom(.05);
        if (Keyboard.isDown(Keyboard.NUM8)) this.#camera.moveBy(new Point(0, -5));
        if (Keyboard.isDown(Keyboard.NUM2)) this.#camera.moveBy(new Point(0, 5));
        if (Keyboard.isDown(Keyboard.NUM6)) this.#camera.moveBy(new Point(5, 0));
        if (Keyboard.isDown(Keyboard.NUM4)) this.#camera.moveBy(new Point(-5, 0));

        if (this.#mainfunction) {
            this.#mainfunction();
        }

        this.#screen.draw();

        // Checa os emmiters.
        for (let w = 0; w < this.#emmiters.getCount(); w++) {
            let emmit = this.#emmiters.getObject(w);
            if (emmit != null && emmit.isReadyToCreate()) {
                let tempObject = emmit.create();
                this.add(tempObject);
            }
        }

        // this.#physicsSolver.applyForces( this.#objects.getAll() );

        // Desenha os objetos
        // Emmiters não devem aparecer na cena. Mas podemos desenhar suas áreas e timers se quisermos.
        if (Properties.debugEmmiters) {
            for (let w = 0; w < this.#emmiters.getCount(); w++) {
                let emmit = this.#emmiters.getObject(w);
                if (emmit != null) {
                    emmit.update();
                    this.#screen.drawItem(emmit, this.#camera);
                }
            }
        }

        // Desenha os objetos
        for (let w = 0; w < this.#objects.getCount(); w++) {
            let tempObj = this.#objects.getObject(w);
            tempObj.applyForce(new Point(0, .05))
            tempObj.update();
            //if (tempObj.constructor.name == "MovableObject") {
            // Aplica a aceleração final e atualiza os shapes do objeto
            //tempObj.update(this);
            if (tempObj.movableObject) {
                this.#screen.drawItem(tempObj.movableObject, this.#camera);
            } else {
                this.#screen.drawItem(tempObj, this.#camera);
            }
            if (Properties.velocityLine) {
                // TODO: delegar estes desenhos para o próprio objeto dentro de um método draw()
                if (tempObj.movableObject) {
                    this.#screen.drawItem(tempObj.movableObject.velocityShape, this.#camera);
                    this.#screen.drawItem(tempObj.movableObject.accelerationShape, this.#camera);
                } else {
                    this.#screen.drawItem(tempObj.velocityShape, this.#camera);
                    this.#screen.drawItem(tempObj.accelerationShape, this.#camera);
                }
            }
        }

        // Desenha a debugBox, se estiver ativada. Para ela, não usamos câmera.
        if (Properties.debugBox) this.#screen.drawItem(this.#debugbox);
        requestAnimationFrame(this.run.bind(this));
    }
}
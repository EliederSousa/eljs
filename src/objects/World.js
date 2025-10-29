import { ObjectContainer } from "../util/ObjectContainer.js";
import { Screen } from "../core/Screen.js";
import { Camera } from "./Camera.js";
import { Keyboard } from "../input/Keyboard.js";
import { Color } from "../util/Color.js";
import { Point } from "../physics/Point.js";
import { Timer } from "../util/Timer.js";
import { DebugBox } from "../util/DebugBox.js";
import { EmmiterManager } from "./Emmiter.js";


export class World {
    #emmiters;
    #objects;
    #screen;
    #camera;
    #timer;
    #debugbox;
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

        this.#screen.draw();
        for (let w = 0; w < this.#emmiters.getCount(); w++) {
            let emmit = this.#emmiters.getObject(w);
            if (emmit != null && emmit.isReadyToCreate()) {
                let tempObject = emmit.create();
                this.add(tempObject);
            }
        }

        // this.#physicsSolver.applyForces( this.#objects.getAll() );

        // Desenha os objetos
        // Emmiters
        for (let w = 0; w < this.#emmiters.getCount(); w++) {
            let emmit = this.#emmiters.getObject(w);
            if (emmit != null) {
                emmit.update();
                this.#screen.drawItem(emmit, this.#camera);
            }
        }

        // Desenha os objetos
        for (let w = 0; w < this.#objects.getCount(); w++) {
            let tempObj = this.#objects.getObject(w);
            if (tempObj.constructor.name == "MovableObject") {
                // Aplica a aceleração final e atualiza os shapes do objeto
                tempObj.update(this);
                this.#screen.drawItem(tempObj);
                if (Engine.velocityLine) {
                    // TODO: delegar estes desenhos para o próprio objeto dentro de um método draw()
                    this.#screen.drawItem(tempObj.velocityShape, this.#camera);
                    this.#screen.drawItem(tempObj.accelerationShape, this.#camera);
                }
            }
        }

        // Desenha a debugBox, se estiver ativada.
        if (Engine.debugBox) this.#screen.drawItem(this.#debugbox, this.#camera);

        let obj = this.#objects.getAll();
        for (let w in obj) {

        }
        requestAnimationFrame(this.run);
    }

    /*if( window.main) {
        window.main();
    }*/
}
import { ObjectContainer } from "../util/ObjectContainer.js";
import { Screen } from "../core/Screen.js";
import { Camera } from "./Camera.js";
import { Keyboard } from "../input/Keyboard.js";
import { Point } from "../physics/Point.js";
import { Timer } from "../util/Timer.js";
import { DebugBox } from "../util/DebugBox.js";
import { EmmiterManager } from "./Emmiter.js";
import { Properties } from "../core/Properties.js";
import { PhysicsSolver } from "../physics/PhysicsSolver.js";
import { MovableObject } from "./MovableObject.js";


/**
 * World — orchestrator for the full game/application loop.
 *
 * Owns the screen, camera, object container, emitters, and runs
 * a 3-phase loop each frame:
 *   1. **Input** — keyboard/camera controls, user main function, emitter checks
 *   2. **Physics** — force application and collision resolution (via PhysicsSolver)
 *   3. **Render** — background fill, camera transform, draw all objects
 *
 * @example
 * const world = new World();
 * world.screen.setBackgroundColor(Color.fromName("black"));
 * // In a custom loop:
 * world.screen.draw();
 * // ... update objects ...
 * world.screen.drawItem(myShape, world.camera);
 */
export class World {
    /** Managed emitters (particle spawners). */
    #emmiters: ObjectContainer<EmmiterManager>;

    /** All scene objects (shapes, RigidBodies, Grids, etc.). */
    #objects: ObjectContainer<any>;

    /** Timer used internally for frame timing. */
    #timer: Timer;

    /** Debug overlay (stats, mouse coords, etc.). */
    #debugbox: DebugBox;

    /** Optional user-provided callback called every frame in phase 1. */
    #mainfunction: (() => void) | null;

    /** The canvas wrapper. Created in `"fullscreen"` mode by default. */
    screen: Screen;

    /** The scene camera (movable, zoomable, with easing). */
    camera: Camera;

    private lastTime: number = 0;

    constructor() {
        this.#emmiters = new ObjectContainer();
        this.#objects = new ObjectContainer();
        this.screen = new Screen("fullscreen");
        this.camera = new Camera(new Point(this.screen.center.x, this.screen.center.y));
        this.#debugbox = new DebugBox(new Point(5, 5), { container: this.#objects });
        this.#timer = new Timer();
        this.#mainfunction = null;
    }

    /**
     * Returns the center point of the screen.
     */
    getScreenCenter(): Point {
        return this.screen.center;
    }

    /**
     * Registers a function to be called every frame during phase 1 (input).
     * Use this for custom per-frame logic like spawning objects on click.
     *
     * @param func - A callback invoked once per frame with no arguments.
     */
    registerMainFunction(func: () => void): void {
        this.#mainfunction = func;
    }

    /**
     * Adds an object to the scene container.
     * It will be updated and rendered automatically by `run()`.
     */
    add(item: any): void {
        this.#objects.add(item);
    }

    /**
     * Adds a new emitter with the given configuration.
     *
     * @param conf - Emitter config object (passed to `EmmiterManager` constructor).
     */
    addEmitter(conf: any): void {
        this.#emmiters.add(new EmmiterManager(conf));
    }

    /**
     * Runs one frame of the 3-phase loop:
     *
     * **Phase 1 — Input:**
     * - Numpad camera controls (7/9 zoom, 8/2/4/6 pan)
     * - User `mainFunction` callback
     * - Emitter spawn checks
     * - Particle expiry cleanup
     *
     * **Phase 2 — Physics:**
     * - `PhysicsSolver.applyForces()` on all objects
     * - `PhysicsSolver.solveColisions()` on all objects
     *
     * **Phase 3 — Render:**
     * - Background fill
     * - Debug emitter drawing (if enabled)
     * - Object drawing with camera transform
     * - Velocity/acceleration debug lines (if enabled)
     * - DebugBox overlay (if enabled)
     *
     * Call this from `requestAnimationFrame(loop)` or bind it directly:
     * `requestAnimationFrame(() => world.run())`
     */
    run(timestamp: number = 0): void {
        // Calcula o deltaTime em segundos (ex: 0.016 para 60fps)
        if (!this.lastTime) this.lastTime = timestamp;
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Evita saltos gigantescos se a aba do navegador perder o foco (limita a no máximo 1/10 de segundo)
        if (dt > 0.1) dt = 0.1;

        // ─────────────────────────────────────────────────────────────────
        // Phase 1: Input & object lifecycle
        // ─────────────────────────────────────────────────────────────────

        if (Keyboard.isDown(Keyboard.NUM7)) this.camera.decreaseZoom(0.05);
        if (Keyboard.isDown(Keyboard.NUM9)) this.camera.increaseZoom(0.05);
        if (Keyboard.isDown(Keyboard.NUM8)) this.camera.moveBy(new Point(0, -5));
        if (Keyboard.isDown(Keyboard.NUM2)) this.camera.moveBy(new Point(0, 5));
        if (Keyboard.isDown(Keyboard.NUM6)) this.camera.moveBy(new Point(5, 0));
        if (Keyboard.isDown(Keyboard.NUM4)) this.camera.moveBy(new Point(-5, 0));

        if (this.#mainfunction) {
            this.#mainfunction();
        }

        for (let w = 0; w < this.#emmiters.getCount(); w++) {
            const emmit = this.#emmiters.getObject(w);
            if (emmit != null && emmit.isReadyToCreate()) {
                const tempObject = emmit.create();
                this.add(tempObject);
            }
        }

        for (let w = 0; w < this.#objects.getCount(); w++) {
            const obj = this.#objects.getObject(w);
            if (obj !== null && obj.shape?.maxTime != null) {
                if (obj.shape.timer.compare() > obj.shape.maxTime) {
                    this.#objects.del(w);
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────
        // Phase 2: Physics
        // ─────────────────────────────────────────────────────────────────

        let allobjects: any = this.#objects.getAll();

        allobjects.forEach((obj: any[]) => {
            if (obj && obj.constructor.name === "RigidBody") {
                PhysicsSolver.applyForces(obj);
                obj.update(dt, this.screen);
            }
        });

        PhysicsSolver.solveColisions(allobjects);

        // ─────────────────────────────────────────────────────────────────
        // Phase 3: Render
        // ─────────────────────────────────────────────────────────────────

        this.screen.draw();

        if (Properties.debugEmmiters) {
            this.#emmiters.getAll().forEach(emmiter => {
                if (emmiter) {
                    emmiter.update();
                    this.screen.drawItem(emmiter, this.camera);
                }
            });
        }

        this.#objects.getAll().forEach(obj => {
            if (obj !== null) {
                this.screen.drawItem(obj, this.camera);

                if (Properties.velocityLine && obj.movableObject) {
                    const mov: MovableObject = obj.movableObject;

                    const accelVec = mov.lastAcceleration.clone().scale(2).add(mov.position);
                    mov.accelerationShape.position = mov.position;
                    mov.accelerationShape.to = accelVec;
                    // Atualiza linha de velocidade
                    const velVec = mov.velocity.clone().scale(.2).add(mov.position);
                    mov.velocityShape.position = mov.position;
                    mov.velocityShape.to = velVec;

                    this.screen.drawItem(mov.accelerationShape, this.camera);
                    this.screen.drawItem(mov.velocityShape, this.camera);

                }
            }
        });

        if (Properties.debugBox) this.screen.drawItem(this.#debugbox);

        requestAnimationFrame((time) => this.run(time));
    }
}

import { Timer } from "../util/Timer.js";

export class Item {
    #id;
    #type;
    #timer;
    #creationTime;
    #maxTime;

    constructor(config) {
        this.#id = crypto.randomUUID();
        this.#type = config.type || "Item";
        this.#timer = new Timer();
        this.#creationTime = this.#timer.now();
        this.#maxTime = null;
    }

    get id() {
        return this.#id;
    }

    get type() {
        return this.#type;
    }

    get maxTime() {
        return this.#maxTime;
    }

    set maxTime(value) {
        this.#maxTime = value;
    }

    draw(canvas_context, camera, screen) {
        throw new Error("Item::draw(): Uma classe filho não implementou a função draw().");
    }
}
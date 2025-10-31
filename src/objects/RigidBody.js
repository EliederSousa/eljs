export class RigidBody {
    constructor(shape, movable) {
        if (!shape) throw new Error("RigidBody::constructor: Shape inválido.");
        if (!movable) throw new Error("RigidBody::constructor: MovableObject inválido.");
        this.shape = shape;
        this.movableObject = movable;
        this.movableObject.shape = shape;
    }
    update() {
        this.movableObject.update();
    }
    applyForce(force) {
        this.movableObject.applyForce(force);
    }
    draw(canvas_context) {
        this.shape.draw(canvas_context);
    }
}
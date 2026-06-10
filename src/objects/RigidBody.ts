import { Point } from "../physics/Point.js";
import { Shape } from "./Shape.js";
import { MovableObject } from "./MovableObject.js";

/**
 * RigidBody — une um Shape (visual) a um MovableObject (física).
 *
 * É a peça que conecta "como o objeto parece" com "como o objeto se move".
 * Em vez de herdar de Shape ou MovableObject, ele os **compõe**:
 * cada um cuida da sua responsabilidade, e RigidBody os coordena.
 *
 * @example
 * const shape = new CircleObject(pos, { radius: 20, drawMode: "CENTER" });
 * const movable = new MovableObject(pos, { mass: 1, velocity: new Point(0, 0) });
 * const body = new RigidBody(shape, movable);
 *
 * // No loop:
 * body.applyForce(new Point(0, 0.2)); // gravidade
 * body.update();
 * body.draw(ctx);
 */
export class RigidBody {

    /** Representação visual do objeto. */
    shape: Shape;

    /** Componente responsável pela movimentação e física do objeto. */
    movableObject: MovableObject;

    /**
     * @param shape   - Shape visual do objeto.
     * @param movable - MovableObject com as propriedades físicas.
     * @throws Se `shape` não for fornecido.
     * @throws Se `movable` não for fornecido.
     */
    constructor(shape: Shape, movable: MovableObject) {
        if (!shape) throw new Error("RigidBody::constructor: Shape inválido.");
        if (!movable) throw new Error("RigidBody::constructor: MovableObject inválido.");

        this.shape = shape;
        this.movableObject = movable;
    }

    /**
     * Avança a simulação física em um frame.
     * Delega para `MovableObject.update()`, que aplica
     * velocidade, aceleração e sincroniza a posição do shape.
     */
    update(): void {
        this.movableObject.update();
    }

    /**
     * Aplica uma força ao objeto.
     * A força é acumulada na aceleração via 2ª Lei de Newton (F = m·a).
     *
     * @param force - Vetor de força a ser aplicado.
     */
    applyForce(force: Point): void {
        this.movableObject.applyForce(force);
    }

    /**
     * Desenha o shape no canvas na posição atual.
     *
     * @param canvas_context - Contexto 2D do canvas.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        this.shape.draw(canvas_context);
    }

    /**
     * Cria uma cópia deste RigidBody em uma nova posição.
     * Usado pelo `EmmiterManager` para gerar partículas a partir de um template.
     *
     * @param pos - Nova posição para o clone.
     * @returns Novo `RigidBody` com shape e movable clonados.
     */
    clone(pos: Point): RigidBody {
        const shape = this.shape.clone(pos);
        const movable = this.movableObject.clone(pos);
        return new RigidBody(shape, movable);
    }
}
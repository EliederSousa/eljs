import { Point } from "../physics/Point.js";
import { Shape } from "./Shape.js";
import { MovableObject, MovableObjectConfig } from "./MovableObject.js";

export interface RigidBodyConfig extends Omit<MovableObjectConfig, "rotation"> {
    shape: Shape;
    isStatic?: boolean;
}

export class RigidBody {

    /** Representação visual do objeto. */
    shape: Shape;

    /** Componente responsável pela movimentação e física do objeto. */
    movableObject: MovableObject;

    isStatic: boolean;

    constructor(config: RigidBodyConfig) {
        if (!config.shape) {
            throw new Error("RigidBody::constructor: Shape é obrigatório.");
        }

        this.shape = config.shape;
        this.isStatic = config.isStatic ?? false;

        // Extrai a posição e a rotação diretamente do shape fornecido
        const position = this.shape.position.clone();
        const rotation = this.shape.rotation; // Usa a rotação do Shape como inicial

        // Instancia o MovableObject internamente
        this.movableObject = new MovableObject(position, this.shape, {
            ...config,
            mass: config.isStatic ? Infinity : (config.mass ?? 10),
            velocity: config.isStatic ? new Point(0, 0) : config.velocity,
            rotation: rotation,
        });
    }

    /**
     * Avança a simulação física em um frame.
     * Delega para `MovableObject.update()`, que aplica
     * velocidade, aceleração e sincroniza a posição do shape.
     */
    update(dt: number): void {
        if (this.isStatic) {
            this.shape.updateVertices();
        }
        this.movableObject.update(dt);
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
 * @returns Novo `RigidBody` com shape e propriedades físicas clonadas.
 */
    clone(pos: Point): RigidBody {
        // 1. Clona o shape na nova posição desejada
        const clonedShape = this.shape.clone(pos);

        // 2. Cria o novo RigidBody passando o shape clonado e as propriedades físicas atuais
        return new RigidBody({
            shape: clonedShape,
            velocity: this.movableObject.velocity.clone(),
            mass: this.movableObject.mass,
            maxVelocity: this.movableObject.maxVelocity,
            velRotation: this.movableObject.velRotation,
            rotationDecay: this.movableObject.rotationDecay,
            isStatic: this.isStatic
        });
    }
}
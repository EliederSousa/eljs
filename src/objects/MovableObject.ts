import { Properties } from "../core/Properties.js";
import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Item } from "./Item.js";
import { LineObject } from "./Line.js";
import { Shape } from "./Shape.js";

// ─────────────────────────────────────────────
// Tipos auxiliares
// ─────────────────────────────────────────────

/**
 * Configuração aceita pelo construtor de `MovableObject`.
 */
export interface MovableObjectConfig {
    /** Massa do objeto. Afeta o quanto uma força altera a aceleração. Padrão: 1. */
    mass?: number;

    /** Velocidade inicial. */
    velocity: Point;

    /** Aceleração inicial. Padrão: (0, 0). */
    acceleration?: Point;

    /** Velocidade máxima em magnitude. Padrão: `Properties.maxVelocity`. */
    maxVelocity?: number;

    /** Ângulo de rotação inicial em graus. Padrão: 0. */
    rotation?: number;

    /** Velocidade angular inicial. Padrão: 0. */
    velRotation?: number;

    /**
     * Fator de decaimento da rotação por frame (0–1).
     * Quanto mais próximo de 1, mais devagar a rotação desacelera.
     * Padrão: 0.985.
     */
    rotationDecay?: number;
}

/**
 * Ambiente opcional passado para `update()`.
 * Usado para wraparound de tela quando `Properties.circularScreen` está ativo.
 */
export interface Environment {
    screen: { width: number; height: number };
}

// ─────────────────────────────────────────────
// Classe MovableObject
// ─────────────────────────────────────────────

/**
 * MovableObject — componente de física de um objeto na cena.
 *
 * Implementa o ciclo de movimento baseado na 2ª Lei de Newton:
 *   F = m·a  →  a = F/m  →  v += a  →  pos += v
 *
 * Não sabe desenhar a si mesmo além do shape associado e das
 * linhas de debug de velocidade/aceleração. Toda lógica visual
 * fica no `Shape`; toda lógica física fica aqui.
 *
 * Normalmente não é usado sozinho — é encapsulado por `RigidBody`.
 *
 * @example
 * const movable = new MovableObject(pos, {
 *   mass: 2,
 *   velocity: new Point(1, 0),
 * });
 * movable.applyForce(new Point(0, 0.2)); // gravidade
 * movable.update();
 */
export class MovableObject extends Item {

    /** Shape visual sincronizado a cada `update()`. Atribuído pelo `RigidBody`. */
    shape: Shape;

    /** Massa do objeto. Quanto maior, menos uma força o afeta. */
    mass: number;

    /** Posição atual na cena. */
    position: Point;

    /** Velocidade atual. Acumulada a cada frame. */
    velocity: Point;

    /** Aceleração atual. Zerada ao final de cada `update()`. */
    acceleration: Point;

    /** Limite de magnitude da velocidade. */
    maxVelocity: number;

    /** Ângulo de rotação atual em graus. */
    rotation: number;

    /** Velocidade angular atual. Decai a cada frame via `rotationDecay`. */
    velRotation: number;

    /** Fator de decaimento da rotação por frame (0–1). */
    rotationDecay: number;

    /** Cor da linha de debug de velocidade. */
    private velocityLineColor: Color;

    /** Cor da linha de debug de aceleração. */
    private accelerationLineColor: Color;

    /** Linha de debug que representa o vetor velocidade. */
    velocityShape: LineObject;

    /** Linha de debug que representa o vetor aceleração. */
    accelerationShape: LineObject;

    /** Dados originais de configuração, usados para clonar o objeto. */
    private cloneData: MovableObjectConfig;

    /**
     * @param position - Posição inicial na cena.
     * @param conf     - Configuração do objeto. Veja `MovableObjectConfig`.
     */
    constructor(position: Point, shape: Shape, conf: MovableObjectConfig) {
        super({ type: "MovableObject" });

        this.shape = shape;
        this.mass = conf.mass ?? 1;
        this.position = position.clone();
        this.velocity = conf.velocity.clone();
        this.acceleration = conf.acceleration?.clone() ?? new Point(0, 0);
        this.maxVelocity = conf.maxVelocity ?? Properties.maxVelocity;
        this.rotation = conf.rotation ?? shape.rotation ?? 0;
        this.velRotation = conf.velRotation ?? 0;
        this.rotationDecay = conf.rotationDecay ?? 0.985;
        this.cloneData = conf;

        this.velocityLineColor = new Color(0.18, 0.8, 0.4, 0.8);
        this.accelerationLineColor = new Color(1, 0.32, 0.32, 0.8);

        // Linhas de debug inicializadas na posição do objeto.
        // São atualizadas a cada frame em update() quando Properties.velocityLine está ativo.
        this.velocityShape = new LineObject(this.position, {
            to: this.position,
            lineColor: this.velocityLineColor,
            lineWidth: 1,
        });

        this.accelerationShape = new LineObject(this.position, {
            to: this.position,
            lineColor: this.accelerationLineColor,
            lineWidth: 2,
        });
    }

    /**
     * Cria uma cópia deste MovableObject em uma nova posição.
     *
     * @param position - Nova posição para o clone.
     */
    clone(position: Point): MovableObject {
        return new MovableObject(position.clone(), this.shape.clone(), this.cloneData);
    }

    /**
     * Aplica uma força ao objeto seguindo a 2ª Lei de Newton.
     * A força é dividida pela massa antes de ser somada à aceleração,
     * então objetos mais pesados aceleram menos para a mesma força.
     *
     * @param F - Vetor de força a ser aplicado.
     */
    applyForce(F: Point): void {
        if (this.mass === Infinity) return;

        const force = F.clone();
        force.scale(1 / this.mass);
        this.acceleration.add(force);
    }

    update(dt: number, ENV?: Environment): void {
        
        if (this.mass !== Infinity) {
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.maxVelocity);
            this.velocity.scale(Properties.damping);

            const currentVel = this.velocity.clone();
            currentVel.scale(dt);
            this.position.add(currentVel);
        }

        if (Properties.circularScreen && ENV) {
            if (this.position.x > ENV.screen.width) this.position.sub(new Point(ENV.screen.width, 0));
            if (this.position.y > ENV.screen.height) this.position.sub(new Point(0, ENV.screen.height));
            if (this.position.x < 0) this.position.add(new Point(ENV.screen.width, 0));
            if (this.position.y < 0) this.position.add(new Point(0, ENV.screen.height));
        }

        // 1. Atualiza a física da rotação primeiro
        // Rotação: θ += ω * dt
        if (Math.abs(this.velRotation) > 0.001) {
            this.rotation += this.velRotation * dt;
            // O decaimento precisa ser proporcional ao tempo
            this.velRotation *= Math.pow(this.rotationDecay, dt * 60);
        }

        // 2. Sincroniza o Shape com os novos dados físicos calculados NESTE frame
        this.shape.position = this.position;
        this.shape.rotation = this.rotation;

        // 3. CRÍTICO: Força a geometria do shape a recalcular os vértices no mundo
        if (typeof this.shape.updateVertices === "function") {
            this.shape.updateVertices();
        }

        if (Properties.velocityLine) {
            const velocityVec = this.velocity.clone();
            velocityVec.scale(5);
            velocityVec.add(this.position);
            this.velocityShape.position = this.position;
            this.velocityShape.to = velocityVec;

            const accelerationVec = this.acceleration.clone();
            accelerationVec.scale(20);
            accelerationVec.add(this.position);
            this.accelerationShape.position = this.shape.getCenter();
            this.accelerationShape.to = accelerationVec;
        }

        // Zera a aceleração — forças precisam ser reaplicadas a cada frame.
        this.acceleration.scale(0);
    }

    /**
     * Desenha o shape e as linhas de debug de velocidade e aceleração.
     *
     * @param canvas_context - Contexto 2D do canvas.
     */
    draw(canvas_context: CanvasRenderingContext2D): void {
        this.shape.draw(canvas_context);
        this.velocityShape.draw(canvas_context);
        this.accelerationShape.draw(canvas_context);
    }

    /** Imprime no console os vetores atuais de posição, velocidade e aceleração. */
    debug(): void {
        console.log("------ DEBUG -------");
        console.log(`Position     ${this.position.x}, ${this.position.y}`);
        console.log(`Velocity     ${this.velocity.x}, ${this.velocity.y}`);
        console.log(`Acceleration ${this.acceleration.x}, ${this.acceleration.y}`);
        console.log("--------------------");
    }
}
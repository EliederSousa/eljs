import { MathHelper } from "../util/MathHelper.js";

export class Point {
    constructor(x, y) {
        if (y === "angle") {
            this.x = Math.cos(MathHelper._PI180 * x);
            this.y = Math.sin(MathHelper._PI180 * x);
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    clone() {
        return new Point(this.x, this.y);
    }

    add(x, y) {
        if (x.constructor.name === "Point") {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this; // Permite chaining de métodos
    }

    sub(x, y) {
        if (x.constructor.name === "Point") {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    }

    mul(x, y) {
        if (x.constructor.name === "Point") {
            this.x *= x.x;
            this.y *= x.y;
        } else {
            this.x *= x;
            this.y *= y;
        }
        return this;
    }

    div(x, y) {
        if (x.constructor.name === "Point") {
            this.x /= x.x;
            this.y /= x.y;
        } else {
            this.x /= x;
            this.y /= y;
        }
        return this;
    }

    // Função para multiplicar amos x e y por um valor único.
    // Útil após criar um vetor normalizado
    scale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    // Teorema de Pitágoras
    // A hipotenuza é o tamanho do vetor. X e Y são os catetos.
    size() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    // Remover a raíz quadrada ajuda em alguns cálculos.
    fastSize() {
        return (this.x * this.x) + (this.y * this.y);
    }

    // Mantém o vetor com tamanho '1'.
    normal() {
        // Evita divisão por zero.
        const mag = this.size();
        if (mag === 0) return new Point(0, 0);
        return new Point((this.x / this.size()), (this.y / this.size()));
    }

    dot(point) {
        return this.x * point.x + this.y * point.y;
    }

    // Calcula a distância até um ponto usando o teorema de pitágoras.
    distanceTo(point) {
        return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
    }

    rotate(angleDeg) {
        const rad = MathHelper._PI180 * angleDeg;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }

    limit(max) {
        if (this.size() > max) {
            let normalized = this.normal();
            normalized.scale(max);
            this.x = normalized.x;
            this.y = normalized.y;
        }
        return this;
    }

    getAngle() {
        return (MathHelper._180PI * Math.atan2(this.y, this.x));
    }

    toString() {
        return `Point(${this.x}, ${this.y})`;
    }
}
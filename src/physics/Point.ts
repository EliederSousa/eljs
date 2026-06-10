import { MathHelper } from "../util/MathHelper.js";

/**
 * 2D vector used for positions, velocities, accelerations, and vertices.
 *
 * All arithmetic methods (`add`, `sub`, `mul`, `div`, `scale`, `rotate`)
 * **mutate in place** and return `this` for chaining. Use `clone()` to
 * create independent copies before mutation.
 *
 * @example
 * const a = new Point(3, 4);
 * const b = new Point(1, 2);
 * a.add(b).mul(2);           // chained mutation
 * const n = a.normal();      // returns new Point, a is unchanged
 */
export class Point {
    /** X coordinate. */
    x: number;

    /** Y coordinate. */
    y: number;

    /**
     * @param x     X coordinate, or angle in degrees when second arg is `"angle"`.
     * @param y     Y coordinate, or the literal string `"angle"` to use angle-based construction.
     *
     * @example
     * new Point(3, 4)            // cartesian
     * new Point(45, "angle")     // unit vector at 45°
     */
    constructor(x: number, y: number);
    constructor(angle: number, y: "angle");
    constructor(x: number, y: number | "angle") {
        if (y === "angle") {
            this.x = Math.cos(MathHelper._PI180 * x);
            this.y = Math.sin(MathHelper._PI180 * x);
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    /**
     * Returns a new Point with the same coordinates.
     */
    clone(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * Adds another vector or scalar values to this point.
     *
     * @overload
     * `add(point)` — adds another Point's x/y
     * @overload
     * `add(x, y)` — adds scalar x and y
     */
    add(x: Point): this;
    add(x: number, y: number): this;
    add(x: Point | number, y?: number): this {
        if (x instanceof Point) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y!;
        }
        return this;
    }

    /**
     * Subtracts another vector or scalar values from this point.
     *
     * @overload
     * `sub(point)` — subtracts another Point's x/y
     * @overload
     * `sub(x, y)` — subtracts scalar x and y
     */
    sub(x: Point): this;
    sub(x: number, y: number): this;
    sub(x: Point | number, y?: number): this {
        if (x instanceof Point) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y!;
        }
        return this;
    }

    /**
     * Multiplies this point by another vector or scalar values.
     *
     * @overload
     * `mul(point)` — component-wise multiply by another Point
     * @overload
     * `mul(x, y)` — multiply by scalar x and y
     */
    mul(x: Point): this;
    mul(x: number, y: number): this;
    mul(x: Point | number, y?: number): this {
        if (x instanceof Point) {
            this.x *= x.x;
            this.y *= x.y;
        } else {
            this.x *= x;
            this.y *= y!;
        }
        return this;
    }

    /**
     * Divides this point by another vector or scalar values.
     *
     * @overload
     * `div(point)` — component-wise divide by another Point
     * @overload
     * `div(x, y)` — divide by scalar x and y
     */
    div(x: Point): this;
    div(x: number, y: number): this;
    div(x: Point | number, y?: number): this {
        if (x instanceof Point) {
            this.x /= x.x;
            this.y /= x.y;
        } else {
            this.x /= x;
            this.y /= y!;
        }
        return this;
    }

    /**
     * Multiplies both x and y by `factor` (uniform scaling).
     * Useful after creating a normalized vector to set its length.
     */
    scale(factor: number): this {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    /**
     * Returns the magnitude (length) of this vector.
     * Uses `Math.sqrt` — prefer `fastSize()` when only comparison is needed.
     */
    size(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    /**
     * Returns the squared magnitude of this vector.
     * Avoids `Math.sqrt` — useful for distance comparisons where
     * the actual length is not needed.
     */
    fastSize(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    /**
     * Returns a **new** Point with the same direction and length 1.
     * Does **not** mutate this point. Returns `(0, 0)` for a zero-length vector.
     */
    normal(): Point {
        const mag = this.size();
        if (mag === 0) return new Point(0, 0);
        return new Point((this.x / mag), (this.y / mag));
    }

    /**
     * Returns the dot product of this vector and `point`.
     */
    dot(point: Point): number {
        return this.x * point.x + this.y * point.y;
    }

    /**
     * Returns the Euclidean distance from this point to `point`.
     */
    distanceTo(point: Point): number {
        return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
    }

    /**
     * Rotates this point by `angleDeg` degrees **in place**.
     */
    rotate(angleDeg: number): this {
        const rad = MathHelper._PI180 * angleDeg;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Scales this vector's magnitude down to `max` if it exceeds it.
     * Mutates in place. Useful for clamping velocity.
     */
    limit(max: number): this {
        if (this.size() > max) {
            const normalized = this.normal();
            normalized.scale(max);
            this.x = normalized.x;
            this.y = normalized.y;
        }
        return this;
    }

    /**
     * Returns the angle of this vector in degrees (0–360).
     * Uses `Math.atan2` — returns 0 for the zero vector.
     */
    getAngle(): number {
        return MathHelper._180PI * Math.atan2(this.y, this.x);
    }

    /**
     * Returns a string representation of this Point.
     */
    toString(): string {
        return `Point(${this.x}, ${this.y})`;
    }
}

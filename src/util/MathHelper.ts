import { Point } from "../physics/Point.js";

/**
 * Collection of math constants and utility functions used across the engine.
 */
export const MathHelper = {
    /** 2 * PI */
    _TWOPI: Math.PI * 2,

    /** 180 / PI — converts radians to degrees. */
    _180PI: 180 / Math.PI,

    /** PI / 180 — converts degrees to radians. */
    _PI180: Math.PI / 180,

    /**
     * Returns a random fixed-point number between 0 and `MAX`.
     * @param MAX - Upper bound (exclusive).
     * @param DECIMALS - Number of decimal places (max 32).
     */
    randomFixed(MAX: number, DECIMALS: number): string {
        DECIMALS = DECIMALS > 32 ? 32 : DECIMALS;
        return (Math.random() * MAX).toFixed(DECIMALS);
    },

    /**
     * Returns a random number between `MIN` and `MAX`.
     */
    randomBetween(MIN: number, MAX: number): number {
        return (Math.random() * (MAX - MIN)) + MIN;
    },

    /**
     * Returns 0 or 1 randomly.
     */
    random0_1(): number {
        return Math.random() * 2 >> 0;
    },

    /**
     * Returns a random Point inside a circle.
     * @param POSITION - Center of the circle.
     * @param RADIUS - Radius of the circle.
     */
    randomInsideCircle(POSITION: Point, RADIUS: number): Point {
        const randomAngle = MathHelper.randomFixed(360, 2);
        const randomDist = MathHelper.randomFixed(RADIUS, 2);
        const randomVect = new Point(randomAngle, "angle");
        randomVect.scale(Number(randomDist));
        const tempCenter = POSITION.clone();
        tempCenter.add(randomVect);
        return tempCenter;
    },
};

/**
 * MathHelper example — prints constants and random utility results
 * to the console.
 *
 * Open the browser DevTools console to see the output.
 */
import { MathHelper } from "../src/util/MathHelper.js";
import { Point } from "../src/physics/Point.js";

// MathHelper constants
console.log(MathHelper._TWOPI); // Math.PI * 2
console.log(MathHelper._180PI); // 180 / Math.PI
console.log(MathHelper._PI180); // Math.PI / 180

// Random fixed-point number between 0 and 10, 5 decimal places
console.log(MathHelper.randomFixed(10, 5));
console.log(MathHelper.randomFixed(10, 5));

// Random fixed-point number between 0 and 100, 32 decimal places (auto-clamped)
console.log(MathHelper.randomFixed(100, 32));
console.log(MathHelper.randomFixed(100, 32));
console.log(MathHelper.randomFixed(100, 50));

// Random number between A and B
console.log(MathHelper.randomBetween(20, 30));
console.log(MathHelper.randomBetween(20, 30));
console.log(MathHelper.randomBetween(20, 30));

// Randomly returns 0 or 1
console.log(MathHelper.random0_1());
console.log(MathHelper.random0_1());
console.log(MathHelper.random0_1());
console.log(MathHelper.random0_1());

// Random point inside a circle of radius 20 centred at {100, 100}
console.log(MathHelper.randomInsideCircle(new Point(100, 100), 20));
console.log(MathHelper.randomInsideCircle(new Point(100, 100), 20));
console.log(MathHelper.randomInsideCircle(new Point(100, 100), 20));
const randomPoint = MathHelper.randomInsideCircle(new Point(100, 100), 20);
// Point methods work as usual
console.log(randomPoint.x, randomPoint.y);
randomPoint.add(new Point(10, 10));
console.log(randomPoint.x, randomPoint.y);

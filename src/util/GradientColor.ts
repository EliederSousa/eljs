import { Color } from "./Color.js";

/**
 * Radial gradient colour used for glow / particle / light effects.
 *
 * Instead of a single fill colour, a `GradientColor` holds a list of
 * `Color` stops that are used to create a `createRadialGradient()`.
 *
 * Every `Shape` that supports `Color` also supports `GradientColor`.
 */
export class GradientColor {
    /** Colour stops for the gradient. */
    colors: Color[] = [];

    /**
     * How much (in pixels) to shrink the gradient radius relative
     * to the shape radius. Prevents hard edges where the gradient
     * terminates abruptly.
     */
    radiusOffset = 5;

    /**
     * Adds a colour stop. Stops are evenly spaced — the first is
     * at 0% and the last at 100%.
     */
    addColor(color: Color): void {
        this.colors.push(color);
    }

    /**
     * Returns a deep copy of this gradient.
     */
    clone(): GradientColor {
        const grad = new GradientColor();
        grad.radiusOffset = this.radiusOffset;
        this.colors.forEach((color) => {
            grad.addColor(color.clone());
        });
        return grad;
    }
}

/**
 * Global static flags and configuration values.
 *
 * Toggle these at runtime to control debug overlays, physics limits,
 * and rendering behaviour across the entire scene.
 */
export class Properties {
    /** Draw the debug info box (FPS, mouse coords, key states). */
    static debugBox = false;

    /** Draw velocity and acceleration debug lines on moving objects. */
    static velocityLine = false;

    /** Draw emitter areas and timers. */
    static debugEmmiters = false;

    /** Maximum velocity magnitude for any MovableObject. */
    static maxVelocity = 1000;

    static gravity = -0.1;
    static wind = 1;

    /** Wrap objects around screen edges instead of letting them escape. */
    static circularScreen = false;
}

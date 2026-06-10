import { Item } from "./Item.js";

/** Easing function type: maps a normalised time `t` [0,1] to a eased value. */
type EasingFn = (t: number) => number;

/**
 * Camera that can follow targets, zoom, and apply easing for smooth movement.
 *
 * Used by `Screen.drawItem()` — call `camera.apply(context, screenCenter)`
 * before drawing scene objects.
 */
export class Camera extends Item {

    static easing = {
        linear: "linear",
        easeInSine: "easeInSine",
        easeOutSine: "easeOutSine",
        easeInOutSine: "easeInOutSine",
        easeInQuad: "easeInQuad",
        easeOutQuad: "easeOutQuad",
        easeInOutQuad: "easeInOutQuad",
        easeInCubic: "easeInCubic",
        easeOutCubic: "easeOutCubic",
        easeInOutCubic: "easeInOutCubic",
        easeOutElastic: "easeOutElastic",
        easeOutBack: "easeOutBack",
    } as const;

    position: any;
    zoom: number;
    rotation: number;
    target: any;
    smoothFactor: number;
    easingType: string;
    easings: Record<string, EasingFn>;

    constructor(point: any, config: any = {}) {
        config.type = "Camera";
        super(config);
        this.position = point;
        this.zoom = config.zoom || 1;
        this.rotation = config.rotation || 0;

        this.target = point.clone();

        this.smoothFactor = config.smoothFactor || 0.3;

        this.easingType = config.easingType || "linear";

        this.easings = {
            linear: (t) => t,
            easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
            easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
            easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

            easeInQuad: (t) => t * t,
            easeOutQuad: (t) => t * (2 - t),
            easeInOutQuad: (t) => (t < 0.5) ? (2 * t * t) : (-1 + (4 - 2 * t) * t),

            easeInCubic: (t) => t * t * t,
            easeOutCubic: (t) => (--t) * t * t + 1,
            easeInOutCubic: (t) => (t < 0.5)
                ? 4 * t * t * t
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

            easeOutElastic: (t) => {
                const p = 0.3;
                return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1.3;
            },

            easeOutBack: (t) => {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            },
        };
    }

    increaseZoom(increment: number): void {
        if (this.zoom >= 100) return;
        this.zoom += increment;
    }

    decreaseZoom(increment: number): void {
        if (this.zoom <= 0.05) {
            this.zoom = 0.05;
            return;
        }
        this.zoom -= increment;
        if (this.zoom <= 0.05) this.zoom = 0.05;
    }

    /** Instantly moves the camera to `position`. */
    moveTo(position: any): void {
        this.position = position.clone();
        this.target = position.clone();
    }

    /** Smoothly moves the camera toward `position` over multiple frames. */
    moveSmoothTo(position: any): void {
        this.target = position.clone();
    }

    /** Moves the camera by `delta` (a Point offset). */
    moveBy(delta: any): void {
        this.position.add(delta);
    }

    /**
     * Applies the camera transform to the canvas context.
     * Call before drawing scene objects, then `context.restore()` after.
     */
    apply(context: CanvasRenderingContext2D, screenCenter: { x: number; y: number }): void {
        context.scale(this.zoom, this.zoom);
        context.translate(
            (screenCenter.x / this.zoom) - this.position.x,
            (screenCenter.y / this.zoom) - this.position.y,
        );
    }

    /**
     * Updates the camera position toward its target using the configured easing.
     * @param easingType - Override the easing type for this frame (optional).
     */
    update(easingType?: string): void {
        const easing = this.easings[easingType || this.easingType] || this.easings.linear;
        const t = this.smoothFactor;
        const easeT = easing(t);

        this.position.x += (this.target.x - this.position.x) * easeT;
        this.position.y += (this.target.y - this.position.y) * easeT;
    }

    draw(canvas_context: CanvasRenderingContext2D): void {
        canvas_context.save();
        canvas_context.strokeStyle = "red";
        canvas_context.strokeRect(this.position.x - 10, this.position.y - 10, 20, 20);
        canvas_context.restore();
    }
}

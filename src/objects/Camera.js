import { Item } from "./Item.js";

export class Camera extends Item {

    static easing = {
        linear: "linear",
        easeInSine: "easeInSine",
        easeOutSine: "easeOutSine",
        easeInOutSine: "easeInOutSine",
        easeInQuad: "easeInQuad",
        easeOutQuad: "easeOutQuad",
        easeInOutQuad: "easeInOutQuad",
        // Cúbicos
        easeInCubic: "easeInCubic",
        easeOutCubic: "easeOutCubic",
        easeInOutCubic: "easeInOutCubic",
        // Elástico (leve efeito de mola)
        easeOutElastic: "easeOutElastic",
        easeOutBack: "easeOutBack"
    }

    constructor(point, config = {}) {
        config.type = "Camera";
        super(config);
        this.position = point;
        this.zoom = config.zoom || 1;
        this.rotation = config.rotation || 0;

        // Posição alvo para movimento suave
        this.target = point.clone();

        // Fator de suavização (0.1 = lento, 1 = instantâneo)
        this.smoothFactor = config.smoothFactor || 0.1;

        this.easingType = config.easingType || "linear";

        this.easings = {
            linear: t => t,
            easeInSine: t => 1 - Math.cos((t * Math.PI) / 2),
            easeOutSine: t => Math.sin((t * Math.PI) / 2),
            easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,

            // Quadráticos
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => (t < 0.5) ? (2 * t * t) : (-1 + (4 - 2 * t) * t),

            // Cúbicos
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => (t < 0.5)
                ? 4 * t * t * t
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

            // Elástico (leve efeito de mola)
            easeOutElastic: t => {
                const p = 0.3;
                return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1.3;
            },

            // Suavização tipo “back” (ultrapassa um pouco e volta)
            easeOutBack: t => {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            },
        };
    }

    increaseZoom(increment) {
        if (this.zoom >= 100) return;
        this.zoom += increment;
    }

    decreaseZoom(increment) {
        if (this.zoom <= 0.05) {
            this.zoom = 0.05;
            return;
        }
        this.zoom -= increment;
        if (this.zoom <= 0.05) this.zoom = 0.05;
    }

    moveTo(position) {
        this.position = position.clone();
        this.target = position.clone();
    }

    moveSmoothTo(position) {
        this.target = position.clone();
    }

    moveBy(delta) {
        this.position.add(delta);
    }

    apply(context, screenCenter) {
        context.scale(this.zoom, this.zoom);
        // Precisa ser negativo pois quando fazemos context.restore() na Screen a translação na verdade estamos colocando os
        // objetos na direção contrária da câmera. 
        context.translate(
            (screenCenter.x / this.zoom) - this.position.x,
            (screenCenter.y / this.zoom) - this.position.y,
        );

    }

    /**
     * Atualiza a posição da câmera suavemente usando o easing especificado.
     * @param {string} easingType - Nome do easing (opcional)
     */
    update(easingType) {
        const easing = this.easings[easingType || this.easingType] || this.easings.linear;
        const t = this.smoothFactor;

        // Calcula a fração suavizada
        const easeT = easing(t);

        this.position.x += (this.target.x - this.position.x) * easeT;
        this.position.y += (this.target.y - this.position.y) * easeT;

        super.update(this.position);
    }

    draw(canvas_context) {
        canvas_context.save();
        canvas_context.strokeStyle = "red";
        canvas_context.strokeRect(this.position.x - 10, this.position.y - 10, 20, 20);
        canvas_context.restore();
    }
}
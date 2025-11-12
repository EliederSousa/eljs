import { Color } from "./Color.js";

export class GradientColor {

    constructor() {
        this.colors = [];
        // Todo shape é desenhado baseado no radius. Essas propriedade configura quanto a menos do radius será usado para desenhar.
        // Ex: se um círculo tem 10 de radius, e setar 5 aqui, o createRadialGradient() só usará 10 - 5 = 5.
        // Isso evita o shape ter uma borda que não deveria ter por que o gradiente termina abruptamente.
        this.radiusOffset = 5;
    }

    addColor(color) {
        this.colors.push(color);
    }

    clone() {
        let grad = new GradientColor();
        grad.radiusOffset = this.radiusOffset;
        this.colors.forEach((color) => {
            grad.addColor(color.clone())
        });
        return grad;
    }

}
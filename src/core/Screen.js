import { Color } from "../util/Color.js";

export class Screen {
    constructor(MODE) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas_layer";
        this.context = this.canvas.getContext("2d");
        this.width = 0;
        this.height = 0;
        this.center = { x: 0, y: 0 };
        this.bgColor = new Color(0, 0, 0, .2);
        this.zoom = 1;
        this.borderSize = 0;

        //Descomente para criar uma borda ao redor do canvas.        
        //this.canvas.style.border = `${this.borderSize}px solid red`;

        if (MODE == "fullscreen") {
            document.body.style.margin = "0px";
            document.body.style.overflow = "hidden";
            this.width = this.canvas.width = window.innerWidth - (2 * this.borderSize);
            this.height = this.canvas.height = window.innerHeight - (2 * this.borderSize);
            this.center = { x: this.width / 2, y: this.height / 2 };
            document.body.appendChild(this.canvas);
        } else {
            // TODO: Workaround: "-8" foi a forma que encontrei para que o
            // canvas fique dentro de uma div com padding e borda de 2px.
            this.width = this.canvas.width = MODE.offsetWidth - 8;
            this.height = this.canvas.height = MODE.offsetHeight - 8;
            this.center = {
                x: this.width / 2,
                y: this.height / 2
            };
            MODE.appendChild(this.canvas);
        }
    }

    draw() {
        this.context.save();
        this.context.globalCompositeOperation = "source-over";
        this.context.fillStyle = this.bgColor.CSS;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    }

    drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (sw !== undefined) {
            this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        } else {
            this.context.drawImage(image, sx, sy);
        }
    }

    drawItem(item, camera) {
        if (!item.draw || typeof item.draw !== "function") {
            throw new Error("Screen::drawItem: o objeto não implementa draw().")
        }

        this.context.save();

        // Aplica a câmera (posição e zoom)
        if (camera instanceof Object && camera.apply) {
            camera.apply(this.context, this.center);
        } else {
            this.context.scale(this.zoom, this.zoom);
        }

        item.draw(this.context, camera, this);
        this.context.restore();
    }

    measureText(text) {
        return this.context.measureText(text);
    };

    resize(w, h) {
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.center = { x: w / 2, y: h / 2 };
    }

    /**
     * Configura uma nova cor para o background do canvas.
     * @param  Cor definida com new Color(r,g,b,a);
     * @returns {void}
     */
    setBackgroundColor(color) {
        this.bgColor = color;
    }
}
import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";

interface Drawable {
    draw(context: CanvasRenderingContext2D, camera: any, screen: Screen): void;
};

/* criar uma interface para a câmera também.
interface Camera {
    apply(context: CanvasRenderingContext2D, center: Point): void;
}

drawItem(item: Drawable, camera?: Camera): void { ... }
*/

export class Screen {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    center: Point;
    bgColor: Color;
    zoom: number;
    borderSize: number;
    drawMode: GlobalCompositeOperation;

    /**
     * Cria e configura o canvas na página.
     * @param {string|HTMLElement} MODE - Use "fullscreen" para tela cheia,
     * ou passe um elemento HTML para renderizar dentro dele.
     *
     * Propriedades:
     * @property {HTMLCanvasElement} canvas    - O elemento canvas criado.
     * @property {CanvasRenderingContext2D} context - Contexto 2D do canvas.
     * @property {number} width                - Largura do canvas em pixels.
     * @property {number} height               - Altura do canvas em pixels.
     * @property {Point} center - Ponto central do canvas.
     * @property {Color} bgColor               - Cor de fundo usada em draw().
     * @property {number} zoom                 - Fator de zoom (usado sem câmera).
     * @property {number} borderSize           - Tamanho da borda (em px).
     * @property {string} drawMode             - Modo de composição do canvas.
     */
    constructor(MODE: "fullscreen" | HTMLElement) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas_layer";
        this.context = this.canvas.getContext("2d")!;
        this.width = 0;
        this.height = 0;
        this.center = new Point(0, 0);
        this.bgColor = new Color(0, 0, 0, .2);
        this.zoom = 1;
        this.borderSize = 0;
        this.drawMode = "source-over";

        //Descomente para criar uma borda ao redor do canvas.        
        //this.canvas.style.border = `${this.borderSize}px solid red`;

        if (MODE == "fullscreen") {
            document.body.style.margin = "0px";
            document.body.style.overflow = "hidden";
            this.width = this.canvas.width = window.innerWidth - (2 * this.borderSize);
            this.height = this.canvas.height = window.innerHeight - (2 * this.borderSize);
            this.center = new Point(this.width / 2, this.height / 2);
            document.body.appendChild(this.canvas);
        } else {
            // TODO: Workaround: "-8" foi a forma que encontrei para que o
            // canvas fique dentro de uma div com padding e borda de 2px.
            this.width = this.canvas.width = MODE.offsetWidth - 8;
            this.height = this.canvas.height = MODE.offsetHeight - 8;
            this.center = new Point(this.width / 2, this.height / 2);
            MODE.appendChild(this.canvas);
        }
    }

    /**
     * Preenche o canvas com a cor de fundo (bgColor).
     * Usa globalCompositeOperation para efeito de rastro/fade.
     */
    draw(): void {
        this.context.save();
        this.context.globalCompositeOperation = this.drawMode;
        //this.context.filter = "blur(1px)";
        this.context.fillStyle = this.bgColor.CSS;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    }

    /**
     * Desenha uma imagem no canvas.
     * @param {HTMLImageElement} image - Imagem a desenhar.
     * @param {number} sx - X de origem (ou X de destino se sem recorte).
     * @param {number} sy - Y de origem (ou Y de destino se sem recorte).
     * @param {number} [sw] - Largura do recorte na origem.
     * @param {number} [sh] - Altura do recorte na origem.
     * @param {number} [dx] - X de destino no canvas.
     * @param {number} [dy] - Y de destino no canvas.
     * @param {number} [dw] - Largura no destino.
     * @param {number} [dh] - Altura no destino.
     */
    drawImage(image: CanvasImageSource, sx: number, sy: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void {
        if (sw !== undefined) {
            this.context.drawImage(image, sx, sy, sw, sh!, dx!, dy!, dw!, dh!);
        } else {
            this.context.drawImage(image, sx, sy);
        }
    }
    /**
     * Desenha qualquer objeto que implemente o método draw().
     * Aplica transformações de câmera ou zoom antes de desenhar.
     * @param {Object} item      - Objeto com método draw(context, camera, screen).
     * @param {Object} [camera]  - Câmera com método apply(context, center).
     * @throws {Error} Se item não tiver o método draw().
     */
    drawItem(item: Drawable, camera?: any): void {
        this.context.save();
        if (camera instanceof Object && camera.apply) {
            camera.apply(this.context, this.center);
        } else {
            this.context.scale(this.zoom, this.zoom);
        }
        item.draw(this.context, camera, this);
        this.context.restore();
    }

    /**
     * Mede a largura de um texto com a fonte atual do contexto.
     * @param {string} text
     * @returns {TextMetrics}
     */
    measureText(text: string): TextMetrics {
        return this.context.measureText(text);
    };

    /**
     * Redimensiona o canvas e recalcula o centro.
     * @param {number} w - Nova largura em pixels.
     * @param {number} h - Nova altura em pixels.
     */
    resize(w: number, h: number): void {
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.center = new Point(w / 2, h / 2);
    }

    /**
     * Define a cor de fundo do canvas.
     * @param {Color} color - Instância de Color(r, g, b, a).
     */
    setBackgroundColor(color: Color): void {
        this.bgColor = color;
    }
}
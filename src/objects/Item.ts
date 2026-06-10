import { Timer } from "../util/Timer.js";

/**
 * Item — classe base de todos os objetos do engine.
 *
 * Todo objeto da cena (shapes, câmera, texto, etc.) herda desta classe.
 * Ela centraliza as propriedades comuns: identidade (id, tipo) e ciclo de
 * vida (timer, tempo máximo de existência).
 */
export class Item {
    /** Identificador único gerado automaticamente (UUID). Nunca muda após a criação. */
    readonly #id: string;

    /** Tipo do objeto em string, ex: "Circle", "Square", "Camera". */
    readonly #type: string;

    /**
     * Tempo máximo de existência do objeto em milissegundos.
     * Se `null`, o objeto existe indefinidamente.
     */
    #maxTime: number | null;

    /**
     * Timer interno usado para controlar o tempo de vida do objeto
     * e qualquer lógica baseada em tempo nas subclasses.
     */
    timer: Timer;

    /**
     * @param config.type    - Nome do tipo do objeto (padrão: "Item").
     * @param config.maxTime - Tempo máximo de vida em ms. Opcional.
     */
    constructor(config: { type?: string; maxTime?: number | null }) {
        this.#id = crypto.randomUUID();
        this.#type = config.type ?? "Item";
        this.timer = new Timer();
        this.#maxTime = config.maxTime ?? null;
    }

    /** Retorna o id único deste objeto. */
    get id(): string {
        return this.#id;
    }

    /** Retorna o tipo do objeto como string. */
    get type(): string {
        return this.#type;
    }

    /** Retorna o tempo máximo de vida, ou `null` se não houver limite. */
    get maxTime(): number | null {
        return this.#maxTime;
    }

    /** Define um novo tempo máximo de vida em milissegundos. */
    set maxTime(value: number | null) {
        this.#maxTime = value;
    }

    /**
     * Método de desenho — deve ser implementado por toda subclasse.
     * Lança erro se chamado diretamente na classe base.
     *
     * @param canvas_context - Contexto 2D do canvas.
     * @param camera         - Câmera da cena (opcional).
     * @param screen         - Tela da cena (opcional).
     */
    draw(canvas_context: CanvasRenderingContext2D, camera?: unknown, screen?: unknown): void {
        throw new Error("Item::draw(): Uma classe filho não implementou a função draw().");
    }
}

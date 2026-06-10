/**
 * @brief Manipulador para eventos de mouse e toque (touch).
 * @details Classe estática responsável por gerenciar as coordenadas espaciais do cursor, 
 * estados de clique e suporte a telas sensíveis ao toque em tempo real.
 */
export class Mouse {
    /** Estrutura interna privada para armazenar as coordenadas X e Y. */
    private static readonly position = { x: 0, y: 0 };

    /** Estado privado indicando se o botão principal do mouse está pressionado. */
    private static clicked: boolean = false;

    /** Estado privado indicando se há uma interação de toque ativa na tela. */
    private static touched: boolean = false;

    // Construtor privado para impedir a instanciação da classe (padrão de Classe Estática)
    private constructor() { }

    /**
     * Adiciona um ouvinte de evento fortemente tipado a um elemento específico ou à janela global.
     * @template T O tipo do elemento alvo (ex: Window, HTMLElement, etc).
     * @template K O tipo do evento mapeado a partir das chaves globais de eventos.
     * @param {T} elem O elemento alvo que receberá o listener (ex: `window` ou um canvas).
     * @param {K} event O nome do evento (ex: `'mousemove'`, `'touchstart'`).
     * @param {(e: any) => void} callback Função de retorno executada quando o evento dispara.
     */
    public static listen<T extends EventTarget, K extends string>(
        elem: T,
        event: K,
        callback: (e: any) => void
    ): void {
        elem.addEventListener(event, callback as EventListener);
    }

    // Inicializador estático para configurar os ouvintes globais
    static {
        // Movimento do Mouse
        Mouse.listen(window, "mousemove", (e: MouseEvent) => {
            Mouse.position.x = e.offsetX;
            Mouse.position.y = e.offsetY;

            /* * SOLUÇÃO DO TODO: Sincronização de Estado
             * e.buttons retorna uma máscara de bits dos botões pressionados.
             * Se for maior que 0, significa que um botão está ativo (ex: recarregou a página clicando).
             */
            if (e.buttons > 0) {
                Mouse.clicked = true;
            } else {
                Mouse.clicked = false;
            }
        });

        // Cliques do Mouse
        Mouse.listen(window, "mousedown", () => {
            Mouse.clicked = true;
        });

        Mouse.listen(window, "mouseup", () => {
            Mouse.clicked = false;
        });

        // Interações de Toque (Touch)
        Mouse.listen(window, "touchstart", () => {
            Mouse.touched = true;
        });

        Mouse.listen(window, "touchend", () => {
            Mouse.touched = false;
        });

        Mouse.listen(window, "touchmove", (e: TouchEvent) => {
            const touches = e.changedTouches;
            if (touches && touches.length > 0) {
                Mouse.touched = true;
                e.preventDefault(); // Evita scroll indesejado em dispositivos móveis durante o jogo/animação
                Mouse.position.x = touches[0].pageX;
                Mouse.position.y = touches[0].pageY;
            }
        });
    }

    // --- GETTERS ESTÁTICOS ---

    /**
     * Coordenada X atual do cursor ou do último toque registrado.
     * @returns {number} Posição no eixo X.
     */
    public static get x(): number {
        return Mouse.position.x;
    }

    /**
     * Coordenada Y atual do cursor ou do último toque registrado.
     * @returns {number} Posição no eixo Y.
     */
    public static get y(): number {
        return Mouse.position.y;
    }

    /**
     * Verifica se o botão do mouse está pressionado neste exato instante.
     * @returns {boolean} `true` se estiver pressionado, caso contrário `false`.
     */
    public static get isDown(): boolean {
        return Mouse.clicked;
    }

    /**
     * Verifica se há alguma interação de toque ativa em dispositivos Mobile/Touch.
     * @returns {boolean} `true` se a tela estiver sendo tocada, caso contrário `false`.
     */
    public static get isTouched(): boolean {
        return Mouse.touched;
    }
}
/**
 * @brief Manipulador para eventos de teclado.
 * @details Classe estática responsável por criar listeners globais e gerenciar o estado 
 * de pressionamento das teclas em tempo real.
 */
export class Keyboard {
    /** Mapa privado que armazena o estado atual de cada tecla (true se pressionada, false se solta). */
    private static readonly keys = new Map<string, boolean>();

    /** Contador privado de quantas teclas estão pressionadas simultaneamente. */
    private static count: number = 0;

    // Construtor privado para impedir a instanciação da classe (padrão de Classe Estática)
    private constructor() { }

    /**
     * Adiciona um listener de evento de teclado estritamente tipado na janela (window).
     * Usamos 'keyof WindowEventMap' limitado a eventos de teclado para satisfazer o TypeScript.
     */
    private static listen<K extends 'keydown' | 'keyup'>(
        event: K,
        callback: (e: WindowEventMap[K]) => void
    ): void {
        window.addEventListener(event, callback);
    }

    // Inicializador estático para configurar os ouvintes de eventos e gerar as propriedades dinâmicas
    static {
        // Agora o TS sabe exatamente que 'e' é um KeyboardEvent
        Keyboard.listen('keydown', (e) => {
            if (!Keyboard.keys.get(e.code)) {
                Keyboard.count++;
            }
            Keyboard.keys.set(e.code, true);
        });

        Keyboard.listen('keyup', (e) => {
            if (Keyboard.keys.get(e.code)) {
                Keyboard.count--;
            }
            Keyboard.keys.set(e.code, false);
        });

        // Gerar dinamicamente propriedades para as Letras (KEY_A até KEY_Z)
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            Keyboard.addCodetoKeyObject(`KEY_${letter}`, `Key${letter}`);
        }

        // Gerar dinamicamente propriedades para os Números e Numpad (0 a 9)
        for (let i = 0; i <= 9; i++) {
            Keyboard.addCodetoKeyObject(`KEY_${i}`, `Digit${i}`);
            Keyboard.addCodetoKeyObject(`NUM${i}`, `Numpad${i}`);
        }
    }

    /**
     * Auxiliar interno para definir propriedades getters estáticas e enumeráveis na classe.
     */
    private static addCodetoKeyObject(key: string, value: string): void {
        Object.defineProperty(Keyboard, key, {
            get() { return value; },
            enumerable: true,
            configurable: true
        });
    }

    // --- GETTERS ESTÁTICOS DE MAPEAMENTO DE TECLAS ---

    public static get BACKSPACE(): string { return 'Backspace'; }
    public static get TAB(): string { return 'Tab'; }
    public static get ENTER(): string { return 'Enter'; }
    public static get SHIFTLEFT(): string { return 'ShiftLeft'; }
    public static get SHIFTRIGHT(): string { return 'ShiftRight'; }
    public static get CONTROLLEFT(): string { return 'ControlLeft'; }
    public static get CONTROLRIGHT(): string { return 'ControlRight'; }
    public static get ALTLEFT(): string { return 'AltLeft'; }
    public static get ALTRIGHT(): string { return 'AltRight'; }
    public static get CAPSLOCK(): string { return 'CapsLock'; }
    public static get ESC(): string { return 'Escape'; }
    public static get SPACE(): string { return 'Space'; }
    public static get PAGEUP(): string { return 'PageUp'; }
    public static get PAGEDOWN(): string { return 'PageDown'; }
    public static get END(): string { return 'End'; }
    public static get HOME(): string { return 'Home'; }
    public static get UP(): string { return 'ArrowUp'; }
    public static get DOWN(): string { return 'ArrowDown'; }
    public static get RIGHT(): string { return 'ArrowRight'; }
    public static get LEFT(): string { return 'ArrowLeft'; }
    public static get DELETE(): string { return 'Delete'; }
    public static get INSERT(): string { return 'Insert'; }
    public static get CONTEXT(): string { return 'ContextMenu'; }

    // Índice de assinatura dinâmico para dar suporte às propriedades geradas via laço for
    [key: string]: any;

    // --- MÉTODOS PÚBLICOS DE VERIFICAÇÃO ---

    /**
     * Verifica se uma tecla específica está pressionada no momento.
     * * @param {string} code O código identificador da tecla (ex: `Keyboard.SPACE` ou `"KeyW"`).
     * @returns {boolean} Retorna `true` se a tecla estiver pressionada, caso contrário `false`.
     * * @example
     * if (Keyboard.isDown(Keyboard.KEY_W)) {
     *  // Move o personagem para frente
     * }
     */
    public static isDown(code: string): boolean {
        return !!Keyboard.keys.get(code);
    }

    /**
     * Obtém o número total de teclas que estão pressionadas simultaneamente neste exato momento.
     * * @returns {number} Quantidade de teclas ativas.
     * * @example
     * console.log(`Teclas ativas: ${Keyboard.getCount()}`);
     */
    public static getCount(): number {
        return Keyboard.count;
    }
}
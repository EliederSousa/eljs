/**
 * @brief Definição de tipos globais para o módulo Keyboard.
 */

/**
 * Interface que representa a estrutura estática completa e as constantes dinâmicas da classe Keyboard.
 */
export interface KeyboardType {
    /**
     * Verifica se uma tecla específica está pressionada no momento.
     * @param code O código identificador da tecla (ex: `Keyboard.SPACE`).
     */
    isDown(code: string): boolean;

    /**
     * Obtém o número total de teclas pressionadas simultaneamente.
     */
    getCount(): number;

    // --- Mapeamento Estático Nátivo de Teclas ---
    readonly BACKSPACE: string;
    readonly TAB: string;
    readonly ENTER: string;
    readonly SHIFTLEFT: string;
    readonly SHIFTRIGHT: string;
    readonly CONTROLLEFT: string;
    readonly CONTROLRIGHT: string;
    readonly ALTLEFT: string;
    readonly ALTRIGHT: string;
    readonly CAPSLOCK: string;
    readonly ESC: string;
    readonly SPACE: string;
    readonly PAGEUP: string;
    readonly PAGEDOWN: string;
    readonly END: string;
    readonly HOME: string;
    readonly UP: string;
    readonly DOWN: string;
    readonly LEFT: string;
    readonly RIGHT: string;
    readonly DELETE: string;
    readonly INSERT: string;
    readonly CONTEXT: string;

    // --- Mapeamento Alfanumérico Gerado Dinamicamente ---
    readonly KEY_A: string; readonly KEY_B: string; readonly KEY_C: string; readonly KEY_D: string;
    readonly KEY_E: string; readonly KEY_F: string; readonly KEY_G: string; readonly KEY_H: string;
    readonly KEY_I: string; readonly KEY_J: string; readonly KEY_K: string; readonly KEY_L: string;
    readonly KEY_M: string; readonly KEY_N: string; readonly KEY_O: string; readonly KEY_P: string;
    readonly KEY_Q: string; readonly KEY_R: string; readonly KEY_S: string; readonly KEY_T: string;
    readonly KEY_U: string; readonly KEY_V: string; readonly KEY_W: string; readonly KEY_X: string;
    readonly KEY_Y: string; readonly KEY_Z: string;

    readonly KEY_0: string; readonly KEY_1: string; readonly KEY_2: string; readonly KEY_3: string;
    readonly KEY_4: string; readonly KEY_5: string; readonly KEY_6: string; readonly KEY_7: string;
    readonly KEY_8: string; readonly KEY_9: string;

    readonly NUM0: string; readonly NUM1: string; readonly NUM2: string; readonly NUM3: string;
    readonly NUM4: string; readonly NUM5: string; readonly NUM6: string; readonly NUM7: string;
    readonly NUM8: string; readonly NUM9: string;

    /**
     * Índice de assinatura dinâmico para dar suporte às propriedades injetadas em tempo de execução.
     */
    readonly [key: string]: any;
}

/**
 * Instância global estática do gerenciador de teclado da biblioteca.
 */
export const Keyboard: KeyboardType;
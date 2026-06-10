import { Keyboard } from './Keyboard';
import { Mouse } from './Mouse';

/**
 * @brief Ponto de entrada unificado para o gerenciamento de entradas (Inputs).
 * @details Agrupa as APIs globais de `Keyboard` (Teclado) e `Mouse` (Mouse/Toque) 
 * sob um único namespace lógico para simplificar o consumo da biblioteca.
 * * @example
 * import { Input } from './core/Input';
 * * function loop() {
 * if (Input.Keyboard.isDown(Input.Keyboard.SPACE)) { ... }
 * if (Input.Mouse.isDown) { console.log(Input.Mouse.x); }
 * }
 */
export const Input = {
    /** Manipulador e gerenciador de eventos do Teclado. */
    Keyboard,
    /** Manipulador e gerenciador de coordenadas e cliques do Mouse/Toque. */
    Mouse
} as const; // 'as const' torna o objeto congelado e read-only em nível de tipo para o TypeScript

// Exportamos também os tipos caso você precise usá-los como referências em parâmetros de funções
export type { Keyboard } from './Keyboard';
export type { Mouse } from './Mouse';
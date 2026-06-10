/**
 * Timer.ts
 * Copyright (c) 2026, Elieder Sousa
 * eliedersousa<at>gmail<dot>com
 * Distributed under the MIT license.
 * See <license.txt> file for details.
 * @date     23/10/25
 * @version  v2.1.0
 * @brief    Manipula contagem de tempo.
 * @details  Use esta classe e crie um handler útil para manipular e comparar intervalos de tempo.
 * Versão convertida e tipada em TypeScript.
 * @depends  Não depende de nenhuma biblioteca.
 *
 * @example Uso básico — verificar se 2 segundos passaram:
 * ```ts
 * const timer = new Timer();
 *
 * // Em um loop (ex: game loop ou setInterval):
 * if (timer.compare() >= 2000) {
 *   console.log(`2s passaram após ${timer.counter} verificações.`);
 *   timer.update(); // reinicia a contagem
 * }
 * ```
 *
 * @example Medir tempo de execução de uma tarefa:
 * ```ts
 * const timer = new Timer();
 * realizarTarefa();
 * console.log(`Tarefa concluída em ${timer.compare()}ms`);
 * ```
 */
export class Timer {
    /**
     * Conta quantas vezes `compare()` foi chamado desde o último `update()`.
     *
     * Útil para saber quantos frames/ciclos se passaram enquanto se aguarda
     * um determinado intervalo de tempo.
     *
     * @example
     * ```ts
     * timer.update();
     * while (timer.compare() < 1000) { } // aguarda 1s
     * console.log(timer.counter); // ex: 6000 (iterações feitas em 1s)
     * ```
     */
    public counter: number = 0;

    /**
     * Timestamp (em ms) da última vez que `update()` foi chamado.
     * Inicializado com `Date.now()` no momento em que o objeto é criado.
     *
     * Serve como ponto de referência para os cálculos de `compare()`.
     */
    public lastTime: number = Date.now();

    /**
     * Reinicia o timer: salva o momento atual em `lastTime` e zera `counter`.
     *
     * Chame este método sempre que quiser começar a medir um novo intervalo
     * de tempo a partir do zero.
     *
     * @returns {void}
     *
     * @example
     * ```ts
     * if (timer.compare() >= 5000) {
     *   console.log("5 segundos passaram!");
     *   timer.update(); // começa a contar os próximos 5s
     * }
     * ```
     */
    public update(): void {
        this.lastTime = this.now();
        this.counter = 0;
    }

    /**
     * Retorna o timestamp atual em milissegundos via `Date.now()`.
     *
     * Centraliza o acesso ao tempo atual, facilitando testes e substituições
     * futuras do mecanismo de tempo.
     *
     * @returns {number} Milissegundos desde 1º de janeiro de 1970 (Unix Epoch).
     *
     * @example
     * ```ts
     * const agora = timer.now();
     * console.log(agora); // ex: 1749560400000
     * ```
     */
    public now(): number {
        return Date.now();
    }

    /**
     * Calcula o tempo decorrido desde o último `update()` e incrementa `counter`.
     *
     * Este é o método principal do Timer. A cada chamada:
     * - `counter` é incrementado em 1 (rastreia quantas verificações foram feitas).
     * - Retorna quantos milissegundos passaram desde o último `update()`.
     *
     * @returns {number} Tempo em ms desde o último `update()` (ou desde a criação do objeto).
     *
     * @example
     * ```ts
     * // Executar algo a cada 500ms
     * if (timer.compare() >= 500) {
     *   executarAcao();
     *   timer.update();
     * }
     * ```
     */
    public compare(): number {
        this.counter++;
        return this.now() - this.lastTime;
    }
}
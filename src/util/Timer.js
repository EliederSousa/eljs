/**
 *  Timer.js
 *  
 *  Copyright (c) 2025, Elieder Sousa
 *  eliedersousa<at>gmail<dot>com
 *  
 *  Distributed under the MIT license. 
 *  See <license.txt> file for details.
 *  
 *  @date     23/10/25
 *  @version  v2.0.0
 *  
 *  @brief    Manipula contagem de tempo.
 *  @details  Use esta classe e crie um handler útil para manipular e comparar intervalos de tempo.
 *  @depends  Não depende de nenhuma biblioteca.
 */

export class Timer {
    /**
     *  @type {number} Indica quantas medições foram feitas entre intervalos de tempo. Zerada toda vez que a função update() for chamada.
     */
    counter = 0;

    /**
     * @type {number} O último timestamp registrado.
     */
    lastTime = (new Date()).getTime();

    /**
     *  @brief Reseta o contador para o tempo atual.
     *  @returns {void}
     *  @details Esta função pode ser chamada quando se deseja resetar o contador interno da classe.
     *  Em uma marcação de tempo, o contador assume o momento (milésimo) atual da chamada da função.
     */
    update() {
        this.lastTime = this.now();
        this.counter = 0;
    };

    /**
     *  @brief Retorna o momento atual.
     *  @returns {number}
     *  @details Oferece uma interface simples para pegar o momento atual e usá-lo em contagens de tempo.
     *  
     */
    now() {
        return Date.now();
    };

    /**
     *  @brief Compara o momento atual com o último momento gravado internamente na classe.
     *  Adiciona 1 ao contador interno, o que torna útil para calcular quantas chamadas a esta
     *  função foram feitas para se chegar em uma quantidade de tempo específica.
     *  @returns {number} Int Tempo em milésimos desde a última chamada da função update (ou da criação da classe).
     *  @details Oferece uma interface para realizar a comparação entre dois intervalos de tempo.
     *  Adiciona 1 ao contador interno, o que torna útil para calcular quantas chamadas a esta
     *  função foram feitas para se chegar em uma quantidade de tempo específica.
     *  
     */
    compare() {
        this.counter++;
        return this.now() - this.lastTime;
    };
};
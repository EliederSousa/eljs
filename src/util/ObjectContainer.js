/**
 *  ObjectContainer.js
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
 *  @brief    Cria um container de objetos.
 *  @depends  Não depende de nenhuma biblioteca.
 *  @details  Armazena objetos e reaproveita IDs deletados para otimizar memória.
 */

export class ObjectContainer {
    #objects = [];
    #deleted = [];
    #count = 0;

    /**
     * @brief Adiciona um objeto ao container.
     * @param {any} obj - O objeto a ser adicionado.
     * @returns {number} ID do objeto no container.
     */
    add(obj) {
        let id;
        if (this.#deleted.length > 0) {
            id = this.#deleted.pop();
            this.#objects[id] = obj;
        } else {
            id = this.#objects.push(obj) - 1;
        }
        this.#count++;
        return id;
    };

    /**
     * @brief Remove um objeto do container.
     * @param {number} id - ID do objeto a ser removido.
     * @returns {void}
     */
    del(id) {
        if (this.#objects[id] != null) {
            this.#objects[id] = null;
            this.#deleted.push(id);
            this.#count--;
            if (this.#count == 0) {
                this.#deleted = [];
                this.#objects = [];
            }
        }
    };

    /**
     * @brief Retorna o objeto correspondente a um ID.
     * @param {number} id - ID do objeto.
     * @returns {any} O objeto armazenado ou null se não existir.
     */
    getObject(id) {
        return this.#objects[id];
    };

    /**
     * @brief Retorna todos os objetos do container.
     * @returns {Array<any>} Lista de objetos (pode conter nulls).
     */
    getAll() {
        return this.#objects;
    }

    /**
     * @brief Retorna a quantidade de objetos ativos no container.
     * @returns {number} Número de objetos ativos.
     */
    getCount() {
        return this.#count;
    };

    /**
     * @brief Compacta o container removendo objetos nulos.
     * @details Útil para otimizar memória e iteração após muitas deleções.
     */
    clean() {
        this.#objects = this.#objects.filter(t => t != null);
        this.#deleted = [];
    }

    /**
     * @brief  Apaga todos os elementos do container.
     */
    reset() {
        this.#objects = [];
        this.#deleted = [];
        this.#count = 0;
    }

    /**
     * @brief Exibe informações de depuração do container.
     * @details Mostra objetos deletados, objetos existentes e contagem total.
     */
    debug = function () {
        console.info("---- OBJECTCONTAINER DEBUG ----");
        console.log("DELETED: " + this.#deleted);
        console.log("OBJECTS: " + this.#objects);
        console.log("COUNT  : " + this.#count);
        console.log("-------------------------------");
    };
};
/**
 *  MathHelper.js
 *  
 *  Copyright (c) 2020, Elieder Sousa
 *  eliedersousa<at>gmail<dot>com
 *  
 *  Distributed under the MIT license. 
 *  See <license.txt> file for details.
 *  
 *  @date     08/02/21
 *  @version  v0.2
 *  
 *  @brief    Funções matemáticas.
 *  @depends  /physics/Point.js
 */

import { Point } from "../physics/Point.js";

export const MathHelper = {
    _TWOPI: Math.PI * 2,
    _180PI: 180 / Math.PI,
    _PI180: Math.PI / 180,
    randomFixed(MAX, DECIMALS) {
        DECIMALS = DECIMALS > 32 ? 32 : DECIMALS;
        return (Math.random() * MAX).toFixed(DECIMALS)
    },
    // Retorna um número aleatório entre um valor mínimo e máximo.
    randomBetween(MIN, MAX) {
        return (Math.random() * (MAX - MIN)) + MIN;
    },

    random0_1() {
        return Math.random() * 2 >> 0;
    },
    randomInsideCircle(POSITION, RADIUS) {
        // Vamos criar um vetor a partir de um ângulo e distancia aleatórios.
        let randomAngle = MathHelper.randomFixed(360, 2);
        let randomDist = MathHelper.randomFixed(RADIUS, 2);
        let randomVect = new Point(randomAngle, "angle");
        randomVect.scale(randomDist);
        // Aogra pegamos o centro do círculo e somamos a ele nosso vetor acima, retornando-o.
        let tempCenter = POSITION.clone();
        tempCenter.add(randomVect);
        return tempCenter;
    }
}
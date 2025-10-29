/// <reference path="../src/util/MathHelper.js" />
import { MathHelper } from "../src/util/MathHelper.js"
import { Point } from "../src/physics/Point.js"

console.log(MathHelper._TWOPI) // MathHelper.PI * 2
console.log(MathHelper._180PI) // 180 / MathHelper.PI
console.log(MathHelper._PI180) // MathHelper.PI / 180

// Retorna um número aleatório entre 0 e 10, com 5 casas decimais.
console.log(MathHelper.randomFixed(10, 5))
console.log(MathHelper.randomFixed(10, 5))

// Retorna um número aleatório entre 0 e 100, com 32 casas decimais (máximo número de casas decimais possíveis, acima disto a função atribui 32).
console.log(MathHelper.randomFixed(100, 32))
console.log(MathHelper.randomFixed(100, 32))
console.log(MathHelper.randomFixed(100, 50))

// Retorna um número aleatório entre A e B.
console.log(MathHelper.randomBetween(20, 30));
console.log(MathHelper.randomBetween(20, 30));
console.log(MathHelper.randomBetween(20, 30));

// Retorna aleatóriamente 0 ou 1.
console.log(MathHelper.random0_1())
console.log(MathHelper.random0_1())
console.log(MathHelper.random0_1())
console.log(MathHelper.random0_1())

// Retorna um ponto aleatório dentro de um círculo de raio 20, e centro em {100, 100}.
console.log(MathHelper.randomInsideCircle(new Point(100, 100), 20));
console.log(MathHelper.randomInsideCircle(new Point(100, 100), 20));
console.log(MathHelper.randomInsideCircle(new Point(100, 100), 20));
let w = MathHelper.randomInsideCircle(new Point(100, 100), 20);
// Use métodos da classe Point normalmente
console.log(w.x, w.y);
w.add(new Point(10, 10))
console.log(w.x, w.y);
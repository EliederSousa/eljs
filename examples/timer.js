import { Timer } from "../src/util/Timer.js";

/**
 * Este exemplo cria uma instância do objeto Timer, e usa o método compare() para saber se já passaram 2 segundos
 * desde a última atualização do relógio. Se sim, atualiza-o usando update() e imprime a o tempo decorrido entre o início
 * do script até agora usando now().
 */
const timer = new Timer();
const startingTime = timer.now();

const loop = () => {
    if (timer.compare() > 2000) {
        timer.update();
        console.log(timer.now() - startingTime);
    }
    requestAnimationFrame(loop);
}
loop();
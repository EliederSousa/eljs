export const Mouse = (() => {
    const position = { x: 0, y: 0 };
    let isClicked = false;
    let isTouched = false;

    const listen = (elem, event, callback) => elem.addEventListener(event, callback);

    listen(window, "mousemove", (e) => {
        position.x = e.offsetX;
        position.y = e.offsetY;
    });

    /* TODO: listen( 'mousedown'... Manipular ambos botoes. Perceba que ele só atualiza quando clica. Se recarregar a página mantendo o mouse pressionado, não vai ter chamado a função e ela será 'false', porém com o mouse clicado. */
    listen(window, "mousedown", () => (isClicked = true));
    listen(window, "mouseup", () => (isClicked = false));
    listen(window, "touchstart", (e) => (isTouched = true));
    listen(window, "touchend", (e) => (isTouched = false));
    listen(window, "touchmove", (e) => {
        let touches = e.changedTouches;
        if (touches) {
            isTouched = true;
            e.preventDefault();
            position.x = touches[0].pageX;
            position.y = touches[0].pageY;
        }
    });

    return {
        get x() { return position.x; },
        get y() { return position.y; },
        get isDown() { return isClicked; },
        get isTouched() { return isTouched; },
        listen, // Exporta a função caso eu queira registrar um evento para um elemento em particular e não a window inteira.
    };
})();

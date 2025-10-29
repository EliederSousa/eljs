/**
 *  @brief Manipulador para teclado. *  
 *  @details Classe para criar listeners para teclado, configurando-os na inicialização.
 */
export const Keyboard = (() => {

    const keys = new Map();
    let count = 0;

    const listen = (event, callback) => window.addEventListener(event, callback);

    listen('keydown', (e) => {
        if (!keys.get(e.code)) count++;
        keys.set(e.code, true); // e.code retorna o nome da tecla ('Backspace, ControlLeft')
    });

    listen('keyup', (e) => {
        if (!keys.get(e.code)) count--;
        keys.set(e.code, false); // e.code retorna o nome da tecla ('Backspace, ControlLeft')
    });

    const staticKeyObject = {
        get BACKSPACE() { return 'Backspace' },
        get TAB() { return 'Tab' },
        get ENTER() { return 'Enter' },
        get SHIFTLEFT() { return 'ShiftLeft' },
        get SHIFTRIGHT() { return 'ShiftRight' },
        get CONTROLLEFT() { return 'ControlLeft' },
        get CONTROLRIGHT() { return 'ControlRight' },
        get ALTLEFT() { return 'AltLeft' },
        get ALTRIGHT() { return 'AltRight' },
        get CAPSLOCK() { return 'CapsLock' },
        get ESC() { return 'Escape' },
        get SPACE() { return 'Space' },
        get PAGEUP() { return 'PageUp' },
        get PAGEDOWN() { return 'PageDown' },
        get END() { return 'End' },
        get HOME() { return 'Home' },
        get UP() { return 'ArrowUp' },
        get DOWN() { return 'ArrowDown' },
        get RIGHT() { return 'ArrowRight' },
        get LEFT() { return 'ArrowLeft' },
        get DELETE() { return 'Delete' },
        get INSERT() { return 'Insert' },
        get CONTEXT() { return 'ContextMenu' },
        isDown: (code) => !!keys.get(code),
        getCount: () => count,
    };

    const addCodetoKeyObject = (key, value) => {
        Object.defineProperty(staticKeyObject, key, {
            get() { return value },
            enumerable: true
        });
    }

    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        addCodetoKeyObject(`KEY_${letter}`, `Key${letter}`);
    }

    for (let i = 0; i <= 9; i++) {
        addCodetoKeyObject(`KEY_${i}`, `Digit${i}`); // Números 0–9
        addCodetoKeyObject(`NUM${i}`, `Numpad${i}`); // Numpad 0–9
    }

    return staticKeyObject;
})();
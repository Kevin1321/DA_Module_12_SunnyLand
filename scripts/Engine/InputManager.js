/**
 * @fileoverview Verwaltet alle Tastatureingaben des Spiels als statische Flags.
 * @module InputManager
 */

/**
 * Statische Klasse zur zentralen Verwaltung von Tastatureingaben.
 * Registriert keydown/keyup Event-Listener und speichert den aktuellen
 * Zustand jeder Eingabe als boolean Flag.
 * Wird von {@link Player} jeden Frame ausgelesen.
 */
class InputManager {

    /**
     * Gibt an ob der InputManager bereits initialisiert wurde.
     * Verhindert doppelte Event-Listener-Registrierung.
     * @static
     * @type {boolean}
     */
    static isInitialized = false;

    /**
     * Gibt an ob die Aufwärts-Taste (W) gedrückt ist.
     * @static
     * @type {boolean}
     */
    static UP = false;

    /**
     * Gibt an ob die Abwärts-Taste (S) gedrückt ist.
     * @static
     * @type {boolean}
     */
    static DOWN = false;

    /**
     * Gibt an ob die Links-Taste (A) gedrückt ist.
     * @static
     * @type {boolean}
     */
    static LEFT = false;

    /**
     * Gibt an ob die Rechts-Taste (D) gedrückt ist.
     * @static
     * @type {boolean}
     */
    static RIGHT = false;

    /**
     * Gibt an ob die Sprungtaste (Space) gedrückt ist.
     * @static
     * @type {boolean}
     */
    static JUMP = false;

    /**
     * Gibt an ob die Schießtaste (Q) gedrückt ist.
     * @static
     * @type {boolean}
     */
    static SHOOT = false;

    /**
     * Initialisiert den InputManager und registriert die Event-Listener.
     * Kann mehrfach aufgerufen werden — registriert die Listener nur einmal.
     * @static
     */
    static Initialize() {
        if (this.isInitialized) return;
        this.RegisterKeyDown();
        this.RegsiterKeyUp();
        this.isInitialized = true;
    }

    /**
     * Registriert den keydown Event-Listener und setzt die entsprechenden Flags auf `true`.
     * Ignoriert gehaltene Tasten (event.repeat).
     * @static
     */
    static RegisterKeyDown() {
        window.addEventListener("keydown", (event) => {
            if (event.repeat) return;
            switch (event.code) {
                case "KeyW": InputManager.UP = true;
                    break;
                case "KeyS": InputManager.DOWN = true;
                    break;
                case "KeyA": InputManager.LEFT = true;
                    break;
                case "KeyD": InputManager.RIGHT = true;
                    break;
                case "Space": InputManager.JUMP = true;
                    break;
                case "KeyQ": InputManager.SHOOT = true;
                    break;
            }
        });
    }

    /**
     * Registriert den keyup Event-Listener und setzt die entsprechenden Flags auf `false`.
     * @static
     */
    static RegsiterKeyUp() {
        window.addEventListener("keyup", (event) => {
            switch (event.code) {
                case "KeyW": InputManager.UP = false;
                    break;
                case "KeyS": InputManager.DOWN = false;
                    break;
                case "KeyA": InputManager.LEFT = false;
                    break;
                case "KeyD": InputManager.RIGHT = false;
                    break;
                case "Space": InputManager.JUMP = false;
                    break;
                case "KeyQ": InputManager.SHOOT = false;
                    break;
            }
        });
    }
}
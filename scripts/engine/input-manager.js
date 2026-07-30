/**
 * @fileoverview Manages all keyboard inputs of the game as static flags.
 * @module InputManager
 */

/**
 * Static class for centralized keyboard input management.
 * Registers keydown/keyup event listeners and stores the current
 * state of each input as a boolean flag.
 * Read by {@link Player} every frame.
 */
class InputManager {

    /**
     * Indicates whether the InputManager has already been initialized.
     * Prevents duplicate event listener registration.
     * @static
     * @type {boolean}
     */
    static isInitialized = false;

    /**
     * Indicates whether the up key (W) is pressed.
     * @static
     * @type {boolean}
     */
    static UP = false;

    /**
     * Indicates whether the down key (S) is pressed.
     * @static
     * @type {boolean}
     */
    static DOWN = false;

    /**
     * Indicates whether the left key (A) is pressed.
     * @static
     * @type {boolean}
     */
    static LEFT = false;

    /**
     * Indicates whether the right key (D) is pressed.
     * @static
     * @type {boolean}
     */
    static RIGHT = false;

    /**
     * Indicates whether the jump key (Space) is pressed.
     * @static
     * @type {boolean}
     */
    static JUMP = false;

    /**
     * Indicates whether the shoot key (Q) is pressed.
     * @static
     * @type {boolean}
     */
    static SHOOT = false;

    /**
     * Initializes the InputManager and registers the event listeners.
     * Can be called multiple times — listeners are only registered once.
     * @static
     */
    static Initialize() {
        if (this.isInitialized) return;
        this.RegisterKeyDown();
        this.RegisterKeyUp();
        this.isInitialized = true;
    }

    /**
     * Registers the keydown event listener and sets the corresponding flags to `true`.
     * Ignores held keys (event.repeat).
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
     * Registers the keyup event listener and sets the corresponding flags to `false`.
     * @static
     */
    static RegisterKeyUp() {
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
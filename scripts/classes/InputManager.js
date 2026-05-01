class InputManager {
    
    static isInitialized = false;

    static UP = false;
    static DOWN = false;
    static LEFT = false;
    static RIGHT = false;
    static JUMP = false;
    static SHOOT = false;


    static Initialize() {
        if(this.isInitialized) return;
        this.RegisterKeyDown();
        this.RegsiterKeyUp();
        this.isInitialized = true;
    }

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
let canvas;
let world;

function init() {
    InputManager.Initialize();
    canvas = document.getElementById("game-canvas");
    world = new World(canvas);
}
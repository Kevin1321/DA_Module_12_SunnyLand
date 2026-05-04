let canvas;
let world;

function main() {
    InputManager.Initialize();
    canvas = document.getElementById("game-canvas");
    world = new World(canvas);
}
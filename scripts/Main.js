let canvas;
let world;

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
    }
});

function main() {
    InputManager.Initialize();
    canvas = document.getElementById("game-canvas");
    world = new World(canvas);
}
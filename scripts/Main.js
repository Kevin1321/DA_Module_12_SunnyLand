/**
 * @fileoverview Entry point of the game. Manages the global game state
 * and controls the UI for start, game over and victory screens.
 * @module Main
 */

/**
 * Reference to the canvas element on which the game is rendered.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Current instance of the game world.
 * Replaced by a new {@link World} instance on every restart.
 * @type {World}
 */
let world;

// Prevents the space key from scrolling the page
window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
    }
});

/**
 * Entry point of the game — called through `onload` in the body tag.
 * Initializes the {@link AudioManager} and {@link InputManager} and displays the start button.
 */
function main() {
    AudioManager.Init();
    InputManager.Initialize();

    canvas = document.getElementById('game-canvas');

    if (window.matchMedia("(pointer: coarse)").matches) {
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                document.getElementById('fullscreen-controls').style.display = 'none';
            }
        });
    }
    setStartButton();
}

function setStartButton() {
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('start-btn').textContent = '▶ Start';
}

/**
 * Starts or restarts the game.
 * Destroys the existing {@link World} instance if one exists and creates a new one.
 * Called by the start/restart button.
 */
function startGame() {
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('game-banner').style.display = 'none';
    if (world) world.Destroy();
    world = new World(canvas);

    if (window.matchMedia("(pointer: coarse)").matches) {
        const container = document.getElementById('canvas-container');
        container.requestFullscreen().then(() => {
            screen.orientation.lock("landscape").catch(() => {
            });
            document.getElementById('fullscreen-controls').style.display = 'flex';
        });
    }
}

/**
 * Displays the game over screen.
 * Called by {@link World#CheckGameState} when the player dies.
 */
function showGameOver() {
    document.getElementById('game-banner').textContent = '💀 Game Over';
    document.getElementById('game-banner').style.display = 'block';
    document.getElementById('start-btn').textContent = '↺ Restart';
    document.getElementById('start-btn').style.display = 'block';
}

/**
 * Displays the victory screen.
 * Called by {@link World#CheckGameState} when the player wins.
 */
function showVictory() {
    document.getElementById('game-banner').textContent = '🏆 Victory!';
    document.getElementById('game-banner').style.display = 'block';
    document.getElementById('start-btn').textContent = '↺ Restart';
    document.getElementById('start-btn').style.display = 'block';
}

/**
 * Toggles fullscreen mode for the canvas container.
 * Uses the browser's native Fullscreen API.
 * Called by the fullscreen button in the UI.
 */
function toggleFullscreen() {
    const container = document.getElementById('canvas-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * Toggles touch controls on and off.
 * Called by the touch toggle button in the normal UI and fullscreen mode.
 */
function toggleTouchControls() {
    const controls = document.getElementById('fullscreen-controls');
    const isVisible = controls.style.display === 'flex';
    controls.style.display = isVisible ? 'none' : 'flex';
}
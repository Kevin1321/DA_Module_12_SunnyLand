/**
 * @fileoverview Einstiegspunkt des Spiels. Verwaltet den globalen Spielzustand
 * und steuert die UI für Start, Game Over und Victory.
 * @module Main
 */

/**
 * Referenz auf das Canvas-Element auf dem das Spiel gerendert wird.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Aktuelle Instanz der Spielwelt.
 * Wird bei jedem Neustart durch eine neue {@link World} Instanz ersetzt.
 * @type {World}
 */
let world;

// Verhindert dass die Leertaste die Seite scrollt
window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
    }
});

/**
 * Einstiegspunkt des Spiels — wird durch `onload` im Body-Tag aufgerufen.
 * Initialisiert den {@link AudioManager} und {@link InputManager} und zeigt den Start-Button.
 */
function main() {
    AudioManager.Init();
    InputManager.Initialize();
    canvas = document.getElementById('game-canvas');

    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('start-btn').textContent = '▶ Start';
}

/**
 * Startet oder startet das Spiel neu.
 * Zerstört die bestehende {@link World} Instanz falls vorhanden und erstellt eine neue.
 * Wird vom Start/Restart-Button aufgerufen.
 */
function startGame() {
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('game-banner').style.display = 'none';
    if (world) world.Destroy();
    world = new World(canvas);
}

/**
 * Zeigt den Game-Over-Bildschirm an.
 * Wird von {@link World#CheckGameState} aufgerufen wenn der Spieler stirbt.
 */
function showGameOver() {
    document.getElementById('game-banner').textContent = '💀 Game Over';
    document.getElementById('game-banner').style.display = 'block';
    document.getElementById('start-btn').textContent = '↺ Restart';
    document.getElementById('start-btn').style.display = 'block';
}

/**
 * Zeigt den Victory-Bildschirm an.
 * Wird von {@link World#CheckGameState} aufgerufen wenn der Spieler gewinnt.
 */
function showVictory() {
    document.getElementById('game-banner').textContent = '🏆 Victory!';
    document.getElementById('game-banner').style.display = 'block';
    document.getElementById('start-btn').textContent = '↺ Restart';
    document.getElementById('start-btn').style.display = 'block';
}

/**
 * Schaltet den Vollbildmodus für den Canvas-Container um.
 * Verwendet die native Fullscreen API des Browsers.
 * Wird vom Fullscreen-Button in der UI aufgerufen.
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
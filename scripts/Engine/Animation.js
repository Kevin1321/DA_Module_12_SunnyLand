/**
 * @fileoverview Verwaltet frame-basierte Sprite-Animationen und dispatcht Events am Animationsende.
 * @module Animation
 */

/**
 * Repräsentiert eine frame-basierte Sprite-Animation.
 * Erbt von {@link EventTarget} um Events wie "EndOfAnimation" dispatchen zu können.
 * @extends EventTarget
 */
class Animation extends EventTarget {

    /**
     * Erstellt eine neue Animation aus einem Array von Bildpfaden.
     * @param {string[]} pathArray - Array von Pfaden zu den Animations-Frames.
     * @param {number} [fps=10] - Frames pro Sekunde der Animation.
     */
    constructor(pathArray, fps = 10) {
        super();
        this.fps = fps;
        this.timer = 0;
        this.currentAnimationFrame = 0;
        this.endOfAnimationEvent = new Event("EndOfAnimation");
        this.frames = pathArray.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
    }

    /**
     * Berechnet anhand der vergangenen Zeit den aktuellen Animations-Frame.
     * Dispatcht ein "EndOfAnimation" Event wenn der letzte Frame erreicht wurde.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     * @returns {HTMLImageElement} Das aktuelle Frame-Bild.
     */
    nextFrame(deltaTime) {
        this.timer += deltaTime;
        if (this.timer >= 1 / this.fps) {
            this.timer = 0;
            this.currentAnimationFrame++;
            if (this.currentAnimationFrame >= this.frames.length) {
                this.dispatchEvent(this.endOfAnimationEvent);
                this.currentAnimationFrame = 0;
            }
        }
        return this.frames[this.currentAnimationFrame];
    }
}
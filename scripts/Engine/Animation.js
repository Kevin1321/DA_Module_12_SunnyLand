/**
 * @fileoverview Manages frame-based sprite animations and dispatches events when an animation ends.
 * @module Animation
 */

/**
 * Represents a frame-based sprite animation.
 * Extends {@link EventTarget} to dispatch events such as "EndOfAnimation".
 * @extends EventTarget
 */
class Animation extends EventTarget {

    /**
     * Creates a new animation from an array of image paths.
     * @param {string[]} pathArray - Array of paths to the animation frames.
     * @param {number} [fps=10] - Frames per second of the animation.
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
     * Calculates the current animation frame based on the elapsed time.
     * Dispatches an "EndOfAnimation" event when the last frame is reached.
     * @param {number} deltaTime - Time in seconds since the previous frame.
     * @returns {HTMLImageElement} The current animation frame image.
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
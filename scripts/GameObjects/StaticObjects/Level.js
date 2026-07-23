/**
 * @fileoverview Implements the level ground as a static GameObject.
 * @module Level
 */

/**
 * The level ground — a static tile that serves as the foundation of the game world.
 * Extends {@link GameObject} with simple rendering without collision logic.
 * Provides the static {@link Level.GROUND} constant which is used by
 * {@link Player} and {@link World} as a reference for the ground position.
 * @extends GameObject
 */
class Level extends GameObject {

    /**
     * Y position of the ground in pixels.
     * Used by {@link Player#OnTick} and {@link Player#ApplyGravity}
     * to keep the player on the ground.
     * @static
     * @type {number}
     */
    static GROUND = 336;

    /**
     * Creates a new level ground object.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     * @param {string} imgSrc - Path to the level sprite from {@link SpriteAssets.LEVEL}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Called every frame and renders the level ground onto the canvas.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
/**
 * @fileoverview Implements decorative props in the game world.
 * @module Prop
 */

/**
 * A decorative prop without collision logic.
 * Extends {@link GameObject} with simple rendering of environmental objects
 * such as trees, rocks and mushrooms.
 * Created by {@link World#CreateProp} with random position and size.
 * @extends GameObject
 */
class Prop extends GameObject {

    /**
     * Creates a new prop.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     * @param {string} imgSrc - Path to the prop sprite from {@link SpriteAssets.PROPS}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Called every frame and renders the prop onto the canvas.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
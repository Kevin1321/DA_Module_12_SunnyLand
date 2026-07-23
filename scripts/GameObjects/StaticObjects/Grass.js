/**
 * @fileoverview Implements the decorative grass layer above the level ground.
 * @module Grass
 */

/**
 * A static grass layer that is rendered decoratively above the main ground.
 * Extends {@link GameObject} with simple rendering without collision logic.
 * Created by {@link World#CreateGrass} as a continuous tile across the entire world width.
 * @extends GameObject
 */
class Grass extends GameObject {

    /**
     * Creates a new grass tile.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     * @param {string} imgSrc - Path to the grass sprite from {@link SpriteAssets.LEVEL}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Called every frame and renders the grass tile onto the canvas.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
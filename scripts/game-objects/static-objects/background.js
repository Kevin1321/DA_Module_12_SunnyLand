/**
 * @fileoverview Implements static background and middleground tiles.
 * @module Background
 */

/**
 * A static background or middleground tile.
 * Extends {@link GameObject} to provide simple sprite rendering without collision logic.
 * Created by {@link World#CreateBackgrounds} and distributed in tiles across the entire world width.
 * @extends GameObject
 */
class Background extends GameObject {

    /**
     * Creates a new background tile.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     * @param {string} imgSrc - Path to the background sprite from {@link SpriteAssets}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Called every frame and renders the background tile onto the canvas.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
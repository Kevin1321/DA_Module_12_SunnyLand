/**
 * @fileoverview Implements the goal object at the end of the level.
 * @module Goal
 */

/**
 * The goal object (wooden house) at the end of the level.
 * Extends {@link GameObject} with collision logic that triggers the player's victory.
 * Created by {@link World#CreateGoal} and indirectly coordinated by {@link World#StartBossFight}.
 * @extends GameObject
 */
class Goal extends GameObject {

    /**
     * Creates a new goal object.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     * @param {string} imgSrc - Path to the sprite from {@link SpriteAssets}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.GOAL;
        this.collidableLayers = [CollisionLayers.PLAYER];

        this.img.src = imgSrc;
    }

    /**
     * Called every frame and renders the goal object onto the canvas.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    /**
     * Called when the player touches the goal object.
     * Sets the player into the Victory state via {@link Player#Victory}.
     * @param {GameObject} collider - The object that touched the goal.
     */
    OnCollisionEnter(collider) {
        super.OnCollision(collider);

        if (collider instanceof Player) {
            collider.Victory();
        }
    }
}
/**
 * @fileoverview Base class for all collectible objects in the game.
 * @module PickUp
 */

/**
 * Base class for all collectible objects.
 * Extends {@link GameObject} with pickup logic and a feedback animation when collected.
 * Further specialized by {@link Cherry} and {@link Gem}.
 * @extends GameObject
 */
class PickUp extends GameObject {

    /**
     * Creates a new PickUp.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.PICKUP;
        this.collidableLayers = [CollisionLayers.PLAYER];

        /** @type {boolean} Indicates whether the PickUp is still active and collectible. */
        this.isActive = true;

        /** @type {boolean} Indicates whether the PickUp has already been collected. */
        this.hasBeenPickedUp = false;

        /**
         * Feedback animation that is played when the PickUp is collected.
         * Triggers {@link PickUp#OnEndOfAnimation} when finished.
         * @type {Animation}
         */
        this.pickedUp = new Animation([
            SpriteAssets.VFX.ITEM_FEEDBACK_1,
            SpriteAssets.VFX.ITEM_FEEDBACK_2,
            SpriteAssets.VFX.ITEM_FEEDBACK_3,
            SpriteAssets.VFX.ITEM_FEEDBACK_4
        ]);

        this.pickedUp.addEventListener("EndOfAnimation", this.OnEndOfAnimation);
    }

    /**
     * Called every frame. Delegates to {@link GameObject#OnTick}.
     * Must be overridden by subclasses to implement animations and rendering.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
    }

    /**
     * Called once when the player touches the PickUp.
     * Must be overridden by subclasses to implement the collection logic.
     * @param {GameObject} collider - The object that touched the PickUp.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
    }

    /**
     * Callback triggered when the feedback animation ends.
     * Deactivates the PickUp and moves it outside the visible area.
     * @type {Function}
     */
    OnEndOfAnimation = () => {
        this.isActive = false;
        this.positionX = -500;
        this.positionY = -500;
    }
}
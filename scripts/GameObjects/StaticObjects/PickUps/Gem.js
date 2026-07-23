/**
 * @fileoverview Implements the gem as a collectible object.
 * @module Gem
 */

/**
 * A collectible gem.
 * Extends {@link PickUp} with an idle animation and collection logic.
 * When collected, the {@link Player#gemsCollected} counter is increased.
 * @extends PickUp
 */
class Gem extends PickUp {

    /**
     * Creates a new gem.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        /**
         * Idle animation of the gem.
         * @type {Animation}
         */
        this.idle = new Animation([
            SpriteAssets.PICK_UPS.GEM_1,
            SpriteAssets.PICK_UPS.GEM_2,
            SpriteAssets.PICK_UPS.GEM_3,
            SpriteAssets.PICK_UPS.GEM_4,
            SpriteAssets.PICK_UPS.GEM_5
        ]);
    }

    /**
     * Called every frame.
     * Plays either the idle animation or the pickup feedback animation and renders the gem.
     * Does nothing if the gem is no longer active.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);

        if (!this.isActive) return;

        if (this.hasBeenPickedUp) {
            this.SetAnimationFrame(this.pickedUp.nextFrame(deltaTime));
        } else {
            this.SetAnimationFrame(this.idle.nextFrame(deltaTime));
        }

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    /**
     * Called when the player touches the gem.
     * Marks the gem as collected and plays the item sound.
     * The {@link Player#gemsCollected} counter is increased in {@link Player#OnCollisionEnter}.
     * @param {GameObject} collider - The object that touched the gem.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        this.hasBeenPickedUp = true;
        AudioManager.Play(AudioAssets.ITEM, false);
    }
}
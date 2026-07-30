/**
 * @fileoverview Implements the cherry as a collectible object.
 * @module Cherry
 */

/**
 * A collectible cherry.
 * Extends {@link PickUp} with an idle animation and collection logic.
 * When collected, the {@link Player#cherriesCollected} counter is increased.
 * @extends PickUp
 */
class Cherry extends PickUp {

    /**
     * Creates a new cherry.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        /**
         * Idle animation of the cherry.
         * @type {Animation}
         */
        this.idle = new Animation([
            SpriteAssets.PICK_UPS.CHERRY_1,
            SpriteAssets.PICK_UPS.CHERRY_2,
            SpriteAssets.PICK_UPS.CHERRY_3,
            SpriteAssets.PICK_UPS.CHERRY_4,
            SpriteAssets.PICK_UPS.CHERRY_5,
            SpriteAssets.PICK_UPS.CHERRY_6,
            SpriteAssets.PICK_UPS.CHERRY_7
        ]);
    }

    /**
     * Called every frame.
     * Plays either the idle animation or the pickup feedback animation and renders the cherry.
     * Does nothing if the cherry is no longer active.
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
     * Called when the player touches the cherry.
     * Marks the cherry as collected and plays the item sound.
     * The {@link Player#cherriesCollected} counter is increased in {@link Player#OnCollisionEnter}.
     * @param {GameObject} collider - The object that touched the cherry.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        this.hasBeenPickedUp = true;
        AudioManager.Play(AudioAssets.ITEM, false);
    }
}
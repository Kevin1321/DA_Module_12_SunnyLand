/**
 * @fileoverview Base class for all playable and non-playable characters.
 * @module Character
 */

/**
 * Base class for all characters in the game.
 * Extends {@link GameObject} with health, death and damage mechanics.
 * Further specialized by {@link Player} and {@link Enemy}.
 * @extends GameObject
 */
class Character extends GameObject {

    /**
     * Creates a new character.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        /**
         * Maximum health of the character.
         * @type {number}
         */
        this.maxHealth = 0;

        /**
         * Current health of the character.
         * @type {number}
         */
        this.health = 0;

        /**
         * Indicates whether the character is dead.
         * Automatically set by {@link Character#TakeDamage}.
         * @type {boolean}
         */
        this.isDead = false;
    }

    /**
     * Called every frame. Delegates to {@link GameObject#OnTick}.
     * Can be overridden by subclasses.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    onTick(deltaTime) {
        super.onTick(deltaTime);
    }

    /**
     * Controls the character's animation logic.
     * Must be implemented by subclasses.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    animate(deltaTime) {
    }

    /**
     * Called once when a new collision begins.
     * @param {GameObject} collider - The object that started the collision.
     */
    onCollisionEnter(collider) {
        super.onCollisionEnter(collider);
    }

    /**
     * Called every frame while a collision is active.
     * @param {GameObject} collider - The object currently colliding with this object.
     */
    onCollision(collider) {
        super.onCollision(collider);
    }

    /**
     * Called once when a collision ends.
     * @param {GameObject} collider - The object that the collision ended with.
     */
    onCollisionExit(collider) {
        super.onCollisionExit(collider);
    }

    /**
     * Reduces the character's health by the specified amount.
     * Health is limited to a minimum value of 0.
     * Sets {@link Character#isDead} to `true` when health reaches 0.
     * @param {number} amount - The amount of damage to apply.
     * @param {source} source - The source of the damage that is applied.
     */
    takeDamage(amount, source = null) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.isDead = this.health == 0;
    }
}
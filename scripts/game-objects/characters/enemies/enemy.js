/**
 * @fileoverview Base class for all enemies in the game.
 * @module Enemy
 */

/**
 * Base class for all enemies.
 * Extends {@link Character} with enemy-specific states and collision layers.
 * Further specialized by {@link Minion} and {@link Boss}.
 * @extends Character
 */
class Enemy extends Character {

    /**
     * Enum of possible enemy states.
     * @readonly
     * @enum {string}
     */
    EnemyState = Object.freeze({
        /** Enemy is standing still. */
        IDLE: "idle",
        /** Enemy is moving. */
        MOVE: "move",
        /** Enemy is attacking. */
        ATTACK: "attack",
        /** Enemy is dead. */
        DEAD: "dead"
    });

    /**
     * Creates a new enemy.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.health = 1;
        this.layer = CollisionLayers.ENEMY;
        this.collidableLayers = [CollisionLayers.PLAYER, CollisionLayers.PROJECTILE];
    }

    /**
     * Called every frame. Delegates to {@link Character#OnTick}.
     * Can be overridden by subclasses.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
    }

    /**
     * Controls the enemy's animation logic. Delegates to {@link Character#Animate}.
     * Must be implemented by subclasses.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    Animate(deltaTime) {
        super.Animate(deltaTime);
    }

    /**
     * Called when the enemy dies.
     * Plays the death effect if the enemy is still active.
     * Can be overridden by subclasses to add additional logic.
     */
    EnemyDead() {
        if (this.isActive) AudioManager.Play(AudioAssets.ENEMY_DEATH, false);
    }
}
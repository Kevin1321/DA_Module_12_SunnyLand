/**
 * @fileoverview Implements projectiles that can be fired by the player.
 * @module Projectile
 */

/**
 * A projectile fired by the player that deals damage to enemies.
 * Managed as a pool in {@link World} and activated via {@link Projectile#Shoot}.
 * Inactive projectiles are parked outside the visible area.
 * @extends GameObject
 */
class Projectile extends GameObject {

    /**
     * Creates a new projectile.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - Starting X position in pixels.
     * @param {number} positionY - Starting Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.PROJECTILE;
        this.collidableLayers = [CollisionLayers.ENEMY];

        this.img.src = SpriteAssets.PROJECTILS.STAR;

        /** @type {number} Maximum lifetime of the projectile in seconds. */
        this.lifetime = 3;

        /** @type {number} Movement speed in pixels per second. */
        this.projectileSpeed = 200;

        /** @type {number} Accumulated time since the projectile was fired in seconds. */
        this.currentTimeAlife = 0;

        /** @type {boolean} Indicates whether the projectile is currently active and flying. */
        this.isBeingShot = false;

        /** @type {number} Movement direction: 1 = right, -1 = left. */
        this.direction = 1;
    }

    /**
     * Called every frame.
     * Moves the projectile and checks whether its lifetime has expired.
     * Renders the projectile only while it is active.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        if (this.isBeingShot) {
            this.positionX += this.projectileSpeed * this.direction * deltaTime;
            this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
            this.currentTimeAlife += deltaTime;

            if (this.currentTimeAlife >= this.lifetime) {
                this.ResetProjectile();
            }
        }
    }

    /**
     * Called when the projectile hits an enemy.
     * Deals 1 damage to the enemy and resets the projectile.
     * @param {GameObject} collider - The object that was hit.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        if (collider instanceof Enemy) {
            collider.TakeDamage(1);
            this.ResetProjectile();
        }
    }

    /**
     * Activates the projectile and sets its starting position and direction.
     * Called by the {@link Player}.
     * @param {number} startPositionX - Starting X position in pixels.
     * @param {number} startPositionY - Starting Y position in pixels.
     * @param {number} direction - Flight direction: 1 = right, -1 = left.
     */
    Shoot(startPositionX, startPositionY, direction) {
        this.isBeingShot = true;
        this.positionX = startPositionX;
        this.positionY = startPositionY;
        this.direction = direction;
    }

    /**
     * Resets the projectile and parks it outside the visible area.
     * Called when the lifetime expires or an enemy is hit.
     */
    ResetProjectile() {
        this.currentTimeAlife = 0;
        this.isBeingShot = false;
        this.positionX = -500;
        this.positionY = -500;
    }
}
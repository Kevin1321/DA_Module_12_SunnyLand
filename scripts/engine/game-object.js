/**
 * @fileoverview Base class for all objects in the game world.
 * @module GameObject
 */

/**
 * Base class for all game objects in the game world.
 * Provides position, size, collision detection, and basic rendering functionality.
 * All gameplay-related objects inherit from this class.
 */
class GameObject {

    /**
     * Creates a new GameObject.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - X position in pixels.
     * @param {number} positionY - Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.img = new Image(this.sizeY, this.sizeX);

        /**
         * Offsets of the collision box from the sprite's edges, in pixels.
         * @type {{ top: number, bottom: number, left: number, right: number }}
         */
        this.collisionOffset = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }

        /**
         * The collision layer this object belongs to.
         * @type {string}
         * @see CollisionLayers
         */
        this.layer = CollisionLayers.DEFAULT;

        /**
         * List of collision layers this object can collide with.
         * @type {string[]}
         * @see CollisionLayers
         */
        this.collidableLayers = [];

        /**
         * Set of GameObjects this object is currently colliding with.
         * Updated every frame by {@link World#ResolveCollisions}.
         * @type {Set<GameObject>}
         */
        this.currentCollisions = new Set();
    }

    /**
     * Sets the current animation frame as the image to be rendered.
     * @param {HTMLImageElement} img - The new animation frame from an {@link Animation}.
     */
    SetAnimationFrame(img) {
        this.img = img;
    }

    /**
     * Called every frame by {@link World#UpdateGameObjects}.
     * Can be overridden by subclasses to implement gameplay logic.
     * @param {number} deltaTime - Time in seconds since the previous frame.
     */
    OnTick(deltaTime) {
    }

    /**
     * Called once when a new collision with another object begins.
     * Can be overridden by subclasses.
     * @param {GameObject} collider - The object that initiated the collision.
     */
    OnCollisionEnter(collider) {
    }

    /**
     * Called every frame while this object is colliding with another object.
     * Can be overridden by subclasses.
     * @param {GameObject} collider - The object currently colliding with this object.
     */
    OnCollision(collider) {
    }

    /**
     * Called once when a collision with another object ends.
     * Can be overridden by subclasses.
     * @param {GameObject} collider - The object the collision ended with.
     */
    OnCollisionExit(collider) {
    }

    /**
     * Draws the object's collision box as a green rectangle on the canvas.
     * Useful for debugging collision issues.
     */
    DrawCollisionRect() {
        this.context.beginPath();
        this.context.lineWidth = "2";
        this.context.strokeStyle = "green";
        this.context.rect(
            this.positionX + this.collisionOffset.left,
            this.positionY + this.collisionOffset.top,
            this.sizeX - this.collisionOffset.right,
            this.sizeY - this.collisionOffset.bottom);
        this.context.stroke();
    }
}
/**
 * @fileoverview Implements the Slimer Minion as a simple patrolling enemy.
 * @module Minion
 */

/**
 * Simple enemy that periodically patrols between left and right.
 * Extends {@link Enemy} with movement and animation logic.
 * Deals 0.5 damage when colliding with the player.
 * @extends Enemy
 */
class Minion extends Enemy {

    /**
     * Creates a new Minion.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - Starting X position in pixels.
     * @param {number} positionY - Starting Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();

        this.state = this.EnemyState.IDLE;
        this.health = 1;
        this.speed = 30;
        this.isMovingRight = false;
        this.direction = -1;

        /**
         * Random interval in milliseconds between direction changes and idle pauses.
         * @type {number}
         */
        this.timeOut = Util.GetRandomRange(3000, 6000);

        this.collisionOffset = {
            top: 20,
            bottom: 20,
            left: 15,
            right: 15
        }

        /**
         * ID of the currently running timeout — required for {@link Minion#EnemyDead}.
         * @type {number}
         */
        this.timeoutId = setTimeout(() => this.SwitchDirection(), this.timeOut);
    }

    /**
     * Called every frame.
     * Checks if the Minion is dead, moves it and renders it.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        if (this.isDead && this.state != this.EnemyState.DEAD) this.EnemyDead();
        if (this.state == this.EnemyState.MOVE) this.Move(deltaTime);
        this.Animate(deltaTime);
        this.DrawImage();
    }

    /**
     * Moves the Minion in its current direction.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    Move(deltaTime) {
        this.positionX += this.speed * this.direction * deltaTime;
    }

    /**
     * Sets the correct animation frame based on the current state.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    Animate(deltaTime) {
        super.Animate(deltaTime);
        if (this.state == this.EnemyState.IDLE) this.SetAnimationFrame(this.idle.nextFrame(deltaTime));
        if (this.state == this.EnemyState.MOVE) this.SetAnimationFrame(this.move.nextFrame(deltaTime));
        if (this.state == this.EnemyState.DEAD) this.SetAnimationFrame(this.death.nextFrame(deltaTime));
    }

    /**
     * Draws the Minion onto the canvas.
     * Flips the sprite horizontally when the Minion moves to the right.
     */
    DrawImage() {
        if (this.isMovingRight) {
            this.context.save();
            this.context.translate(this.sizeX, 0);
            this.context.scale(-1, 1);
            this.positionX *= -1;
        }

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);

        if (this.isMovingRight) {
            this.positionX *= -1;
            this.context.restore();
        }
    }

    /**
     * Changes the Minion's movement direction and starts a new timeout for {@link Minion#Idle}.
     */
    SwitchDirection() {
        this.state = this.EnemyState.MOVE;

        if (this.isMovingRight) {
            this.isMovingRight = false;
            this.direction = -1;
        } else {
            this.isMovingRight = true;
            this.direction = 1;
        }

        this.timeoutId = setTimeout(() => this.Idle(), this.timeOut);
    }

    /**
     * Sets the Minion into the idle state and starts a timeout for {@link Minion#SwitchDirection}.
     */
    Idle() {
        this.state = this.EnemyState.IDLE;
        this.timeoutId = setTimeout(() => this.SwitchDirection(), this.timeOut);
    }

    /**
     * Called when the Minion dies.
     * Cancels the running timeout, sets the state to DEAD and plays the death effect.
     */
    EnemyDead() {
        clearTimeout(this.timeoutId);
        this.state = this.EnemyState.DEAD;
        AudioManager.Play(AudioAssets.ENEMY_DEATH);
    }

    /**
     * Callback triggered when the death animation ends.
     * Deactivates the Minion and moves it outside the visible area.
     * @type {Function}
     */
    OnEndOfAnimation = () => {
        this.isActive = false;
        this.positionX = -1500;
        this.positionY = -1500;
    }

    /**
     * Initializes all {@link Animation} instances for idle, movement and death.
     * Registers the {@link Minion#OnEndOfAnimation} callback on the death animation.
     */
    CreateAnimations() {
        this.idle = new Animation([
            SpriteAssets.SLIMER.IDLE_1,
            SpriteAssets.SLIMER.IDLE_2,
            SpriteAssets.SLIMER.IDLE_3,
            SpriteAssets.SLIMER.IDLE_4,
            SpriteAssets.SLIMER.IDLE_5,
            SpriteAssets.SLIMER.IDLE_6,
            SpriteAssets.SLIMER.IDLE_7,
            SpriteAssets.SLIMER.IDLE_8
        ]);

        this.move = new Animation([
            SpriteAssets.SLIMER.MOVE_1,
            SpriteAssets.SLIMER.MOVE_2,
            SpriteAssets.SLIMER.MOVE_3,
            SpriteAssets.SLIMER.MOVE_4,
            SpriteAssets.SLIMER.MOVE_5,
            SpriteAssets.SLIMER.MOVE_6,
            SpriteAssets.SLIMER.MOVE_7
        ]);

        this.death = new Animation([
            SpriteAssets.VFX.ENEMY_DEATH_1,
            SpriteAssets.VFX.ENEMY_DEATH_2,
            SpriteAssets.VFX.ENEMY_DEATH_3,
            SpriteAssets.VFX.ENEMY_DEATH_4,
            SpriteAssets.VFX.ENEMY_DEATH_5,
            SpriteAssets.VFX.ENEMY_DEATH_6
        ]);

        this.death.addEventListener("EndOfAnimation", this.OnEndOfAnimation);
    }
}
/**
 * @fileoverview Implements the Vulture boss as a flying final enemy.
 * @module Boss
 */

/**
 * The final boss of the game — a flying Vulture that moves randomly through the world.
 * Extends {@link Enemy} with flying movement on the X and Y axes as well as a delayed fight start.
 * Deals 1 damage when colliding with the player and has 5 health points.
 * @extends Enemy
 */
class Boss extends Enemy {

    /**
     * Creates a new Boss.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {number} positionX - Starting X position in pixels.
     * @param {number} positionY - Starting Y position in pixels.
     * @param {number} sizeX - Width in pixels.
     * @param {number} sizeY - Height in pixels.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.createAnimations();
        this.state = this.EnemyState.IDLE;
        this.health = 5;
        this.minSpeed = 50;
        this.maxSpeed = 150;
        this.speedCycleDuration = 5;
        this.speedCycleTimer = 0;

        /**
         * Current movement direction on the X axis (-1, 0 or 1).
         * @type {number}
         */
        this.xDirection = -1;

        /**
         * Current movement direction on the Y axis (-1, 0 or 1).
         * @type {number}
         */
        this.yDirection = -1;

        /**
         * Interval in milliseconds between direction changes.
         * @type {number}
         */
        this.timeOut = 2000;

        this.collisionOffset = {
            top: 30,
            bottom: 20,
            left: 20,
            right: 40
        }

        /**
         * Indicates whether the fight has already started.
         * Prevents another start by {@link World#StartBossFight}.
         * @type {boolean}
         */
        this.fightStarted = false;
    }

    /**
     * Called every frame.
     * Checks if the boss is dead, moves it and renders it.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    onTick(deltaTime) {
        super.onTick(deltaTime);

        if (this.isDead && this.state != this.EnemyState.DEAD) this.enemyDead();
        if (this.state == this.EnemyState.MOVE) {
            this.updateSpeedCycle(deltaTime);
            this.move(deltaTime);
        }
        this.animate(deltaTime);
        this.drawImage();
    }
    
    /**
     * Increases the boss speed linearly from {@link Boss#minSpeed} to {@link Boss#maxSpeed}
     * over {@link Boss#speedCycleDuration} seconds, then resets back to {@link Boss#minSpeed}.
     * Only active while the boss is in the MOVE state.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    updateSpeedCycle(deltaTime) {
        this.speedCycleTimer += deltaTime;
        const t = this.speedCycleTimer / this.speedCycleDuration; // 0 → 1
        this.speed = this.minSpeed + (this.maxSpeed - this.minSpeed) * t;
        if (this.speedCycleTimer >= this.speedCycleDuration) {
            this.speedCycleTimer = 0;
            this.speed = this.minSpeed;
        }
    }

    /**
   * Moves the boss towards the player with a sine wave movement on the Y axis.
   * Limits the position to the world boundaries.
   * @param {number} deltaTime - Time in seconds since the last frame.
   */
    move(deltaTime) {
        // X: towards the player (center boss → center player)
        const targetX = this.player.positionX + this.player.sizeX / 2 - this.sizeX / 2;
        const dx = targetX - this.positionX;
        const distX = Math.abs(dx);

        if (distX > 2) {
            this.positionX += Math.sign(dx) * this.speed * deltaTime;
            this.xDirection = Math.sign(dx);
        }
        this.positionX = Util.clamp(this.positionX, World.WORLD_BOUNDS.minX, World.WORLD_BOUNDS.maxX - this.sizeX);

        // Y: sine wave — moves up and down while approaching
        this.sineTime += deltaTime;
        const AMPLITUDE = 80;
        const FREQUENCY = 1.2;
        const baseY = Level.GROUND - this.sizeY * 0.5; // Startpunkt etwas über Boden
        const targetY = baseY + Math.sin(this.sineTime * FREQUENCY * Math.PI * 2) * AMPLITUDE;

        // Smooth lerp for Y
        const LERP_SPEED = 2;
        this.positionY += (targetY - this.positionY) * LERP_SPEED * deltaTime;
        this.positionY = Util.clamp(
            this.positionY,
            World.WORLD_BOUNDS.minY,
            Level.GROUND - this.sizeY + 50
        );
    }

    /**
     * Sets the correct animation frame based on the current state.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    animate(deltaTime) {
        super.animate(deltaTime);
        if (this.state == this.EnemyState.IDLE) this.setAnimationFrame(this.idle.nextFrame(deltaTime));
        if (this.state == this.EnemyState.MOVE) this.setAnimationFrame(this.flying.nextFrame(deltaTime));
        if (this.state == this.EnemyState.DEAD) this.setAnimationFrame(this.death.nextFrame(deltaTime));
    }


    /**
     * Draws the boss sprite onto the canvas, flipped horizontally when facing right.
     */
    drawImage() {
        if (this.xDirection === 1) {
            this.context.save();
            this.context.translate(this.positionX * 2 + this.sizeX, 0);
            this.context.scale(-1, 1);
        }
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
        if (this.xDirection === 1) {
            this.context.restore();
        }
    }

    /**
     * Starts the boss fight.
     * @param {Player} player - Reference to the player for the tracking logic.
     */
    beginFight(player) {
        this.fightStarted = true;
        this.player = player;
        this.state = this.EnemyState.MOVE;
        this.sineTime = 0;
        AudioManager.stop(AudioAssets.BACKGROUND_MUSIC);
        AudioManager.play(AudioAssets.BOSS_MUSIC, true);
    }

    /**
     * Called when the boss dies.
     * Cancels the running direction timeout, sets the state to DEAD
     * and plays the death effect.
     */
    enemyDead() {
        this.state = this.EnemyState.DEAD;
        AudioManager.play(AudioAssets.ENEMY_DEATH);
    }

    /**
     * Callback triggered when the death animation ends.
     * Deactivates the boss and moves it outside the visible area.
     * @type {Function}
     */
    OnEndOfAnimation = () => {
        this.isActive = false;
        this.positionX = -1500;
        this.positionY = -1500;
    }

    /**
     * Initializes all {@link Animation} instances for idle, flying and death.
     * Registers the {@link Boss#OnEndOfAnimation} callback on the death animation.
     */
    createAnimations() {
        this.idle = new Animation([
            SpriteAssets.VULTURE.IDLE_1,
            SpriteAssets.VULTURE.IDLE_2,
            SpriteAssets.VULTURE.IDLE_3,
            SpriteAssets.VULTURE.IDLE_4
        ]);

        this.flying = new Animation([
            SpriteAssets.VULTURE.FLYING_1,
            SpriteAssets.VULTURE.FLYING_2,
            SpriteAssets.VULTURE.FLYING_3,
            SpriteAssets.VULTURE.FLYING_4
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
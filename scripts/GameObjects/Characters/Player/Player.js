/**
 * @fileoverview Implements the player-controlled character (Foxy).
 * @module Player
 */

/**
 * The player-controlled character.
 * Extends {@link Character} with movement, jumping, shooting,
 * collision handling, animations and player state management.
 * Reads input from {@link InputManager}.
 * Animation logic is delegated to {@link PlayerAnimator}.
 *
 * @extends Character
 */
class Player extends Character {

    /**
     * Possible states of the player.
     * @readonly
     * @enum {string}
     */
    PlayerState = Object.freeze({
        /** Player is standing still. */
        IDLE: "idle",
        /** Player has been standing still for an extended time. */
        LONG_IDLE: "longIdle",
        /** Player is running. */
        RUN: "run",
        /** Player is currently jumping or falling. */
        JUMP: "jump",
        /** Player is currently damaged. */
        HURT: "hurt",
        /** Player is dead. */
        DEAD: "dead",
        /** Player reached the goal and won the game. */
        VICTORY: "victory"
    });

    /**
     * Creates a new player character.
     * @param {CanvasRenderingContext2D} context - Canvas rendering context.
     * @param {number} positionX - Initial X position in pixels.
     * @param {number} positionY - Initial Y position in pixels.
     * @param {number} sizeX - Width of the player in pixels.
     * @param {number} sizeY - Height of the player in pixels.
     * @param {Projectile[]} projectilePool - Pool of reusable projectiles.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, projectilePool) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.projectilePool = projectilePool;
        this.animator = new PlayerAnimator(this);
        this.InitState();
        this.InitPhysics();
        this.InitCombat();
    }

    /**
     * Initializes player state, collision and collection properties.
     */
    InitState() {
        this.layer = CollisionLayers.PLAYER;
        this.collidableLayers = [CollisionLayers.ENEMY, CollisionLayers.PICKUP, CollisionLayers.GOAL];
        this.state = this.PlayerState.IDLE;
        this.maxHealth = 5;
        this.health = 5;
        this.idleTime = 0;
        this.longIdleTime = 5;
        this.gemsCollected = 0;
        this.cherriesCollected = 0;
        this.collisionOffset = { top: 20, bottom: 20, left: 10, right: 20 };
    }

    /**
     * Initializes movement and physics properties.
     */
    InitPhysics() {
        this.velocityY = 0;
        this.isGrounded = true;
        this.speed = 170;
        this.jumpSpeed = 13;
        this.gravity = 30;
        this.moveAmount = 0;
        this.isMovingLeft = false;
    }

    /**
     * Initializes combat, hurt, knockback and invincibility properties.
     */
    InitCombat() {
        this.shootCooldown = 0.5;
        this.isShootOnCooldown = false;
        this.currentCooldownTime = 0;
        this.hurtDuration = 0.6;
        this.currentHurtTime = 0;
        this.knockbackSpeed = 125;
        this.knockbackDir = 1;
        this.isInvincible = false;
        this.invincibleDuration = 1.2;
        this.currentInvincibleTime = 0;
        this.blinkInterval = 0.1;
        this.blinkTimer = 0;
        this.isVisible = true;
    }

    /**
     * Handles the beginning of a collision.
     * Collects pickups and receives damage from enemies.
     * @param {GameObject} collider - Object that started the collision.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        if (collider instanceof Cherry) this.cherriesCollected += 1;
        if (collider instanceof Gem) this.gemsCollected += 1;
        if (collider instanceof Minion) this.TakeDamage(0.5, collider);
        if (collider instanceof Boss) this.TakeDamage(1, collider);
    }

    /**
     * Updates the player every frame.
     * Handles input, physics, state, animation and rendering.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.moveAmount = 0;
        if (this.positionY >= Level.GROUND) this.isGrounded = true;
        this.HandleInput(deltaTime);
        this.UpdateHurt(deltaTime);
        this.ApplyGravity(deltaTime);
        this.SetPlayerState(deltaTime);
        this.animator.Update(deltaTime, this.state, this.velocityY);
        this.DrawImage();
    }

    /**
     * Processes movement and action input unless the player is in a locked state.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    HandleInput(deltaTime) {
        const locked = [this.PlayerState.HURT, this.PlayerState.DEAD, this.PlayerState.VICTORY];
        if (locked.includes(this.state)) return;
        this.MoveRight(deltaTime);
        this.MoveLeft(deltaTime);
        this.Jump(deltaTime);
        this.Shoot(deltaTime);
    }

    /**
     * Moves the player to the right while {@link InputManager.RIGHT} is active.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    MoveRight(deltaTime) {
        if (InputManager.RIGHT) {
            this.moveAmount = deltaTime * this.speed;
            this.positionX += this.moveAmount;
            this.isMovingLeft = false;
        }
    }

    /**
     * Moves the player to the left while {@link InputManager.LEFT} is active.
     * Prevents the player from leaving the left world boundary.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    MoveLeft(deltaTime) {
        if (InputManager.LEFT) {
            this.moveAmount = deltaTime * this.speed;
            this.positionX -= this.moveAmount;
            if (this.positionX < 0) this.positionX = 0;
            this.isMovingLeft = true;
        }
    }

    /**
     * Makes the player jump when grounded and {@link InputManager.JUMP} is active.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    Jump(deltaTime) {
        if (this.isGrounded && InputManager.JUMP) {
            this.velocityY = this.jumpSpeed;
            this.isGrounded = false;
            AudioManager.Play(AudioAssets.JUMP, false);
        }
    }

    /**
     * Applies gravity while airborne and clamps the player to ground level.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    ApplyGravity(deltaTime) {
        if (!this.isGrounded) {
            this.velocityY -= deltaTime * this.gravity;
            this.positionY -= this.velocityY;
            if (this.positionY > Level.GROUND) this.positionY = Level.GROUND;
        }
    }

    /**
     * Fires a projectile from the pool if shooting input is active and off cooldown.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    Shoot(deltaTime) {
        if (InputManager.SHOOT && !this.isShootOnCooldown) {
            this.projectilePool.some(projectile => {
                if (!projectile.isBeingShot) {
                    projectile.Shoot(
                        this.positionX + (this.isMovingLeft ? -15 : 25),
                        this.positionY + 25,
                        this.isMovingLeft ? -1 : 1
                    );
                    return true;
                }
                return false;
            });
            this.isShootOnCooldown = true;
        }
        this.UpdateShootCooldown(deltaTime);
    }

    /**
     * Counts down the shoot cooldown and resets it once expired.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    UpdateShootCooldown(deltaTime) {
        if (!this.isShootOnCooldown) return;
        this.currentCooldownTime += deltaTime;
        if (this.currentCooldownTime >= this.shootCooldown) {
            this.currentCooldownTime = 0;
            this.isShootOnCooldown = false;
        }
    }

    /**
     * Applies damage, triggers knockback and starts the invincibility window.
     * Ignored while the player is invincible.
     * @param {number} amount - Amount of health to subtract.
     * @param {GameObject} source - The object that caused the damage.
     */
    TakeDamage(amount, source) {
        if (this.isInvincible) return;
        super.TakeDamage(amount, source);
        if (source) this.knockbackDir = this.positionX > source.positionX ? 1 : -1;
        this.state = this.PlayerState.HURT;
        this.currentHurtTime = 0;
        this.StartInvincibility();
        AudioManager.Play(AudioAssets.HURT, false);
    }

    /**
     * Resets and starts the invincibility window after taking damage.
     */
    StartInvincibility() {
        this.isInvincible = true;
        this.currentInvincibleTime = 0;
        this.blinkTimer = 0;
        this.isVisible = true;
    }

    /**
     * Advances the hurt and invincibility timers each frame.
     * Delegates to {@link Player#UpdateKnockback} and {@link Player#UpdateInvincibility}.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    UpdateHurt(deltaTime) {
        this.UpdateKnockback(deltaTime);
        this.UpdateInvincibility(deltaTime);
    }

    /**
     * Applies horizontal knockback while in the hurt state and transitions back to idle.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    UpdateKnockback(deltaTime) {
        if (this.state !== this.PlayerState.HURT) return;
        this.currentHurtTime += deltaTime;
        this.positionX += this.knockbackDir * this.knockbackSpeed * deltaTime;
        if (this.currentHurtTime >= this.hurtDuration) this.state = this.PlayerState.IDLE;
    }

    /**
     * Handles the blink effect and expiry of the invincibility window.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    UpdateInvincibility(deltaTime) {
        if (!this.isInvincible) return;
        this.currentInvincibleTime += deltaTime;
        this.blinkTimer += deltaTime;
        if (this.blinkTimer >= this.blinkInterval) {
            this.blinkTimer = 0;
            this.isVisible = !this.isVisible;
        }
        if (this.currentInvincibleTime >= this.invincibleDuration) {
            this.isInvincible = false;
            this.isVisible = true;
        }
    }

    /**
     * Updates the current player state based on input, grounded status and idle duration.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    SetPlayerState(deltaTime) {
        if (this.state === this.PlayerState.VICTORY) return;
        if (this.state === this.PlayerState.HURT) return;
        if (this.isDead) { this.state = this.PlayerState.DEAD; return; }
        if (this.isGrounded) this.SetGroundedState(deltaTime);
        else this.state = this.PlayerState.JUMP;
        if (this.state !== this.PlayerState.IDLE && this.state !== this.PlayerState.LONG_IDLE) this.idleTime = 0;
    }

    /**
     * Determines the correct grounded state based on movement input and idle duration.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    SetGroundedState(deltaTime) {
        if (InputManager.LEFT || InputManager.RIGHT) {
            this.state = this.PlayerState.RUN;
            return;
        }
        this.idleTime += deltaTime;
        this.state = this.idleTime < this.longIdleTime
            ? this.PlayerState.IDLE
            : this.PlayerState.LONG_IDLE;
    }

    /**
     * Draws the player sprite onto the canvas, flipped horizontally when facing left.
     */
    DrawImage() {
        if (!this.isVisible) return;
        if (this.isMovingLeft) this.ApplyFlipTransform();
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
        if (this.isMovingLeft) {
            this.positionX *= -1;
            this.context.restore();
        }
    }

    /**
     * Saves the canvas state and applies a horizontal flip transformation for left-facing rendering.
     */
    ApplyFlipTransform() {
        this.context.save();
        this.context.translate(this.sizeX, 0);
        this.context.scale(-1, 1);
        this.positionX *= -1;
    }

    /**
     * Sets the player state to victory.
     * Called by {@link Goal} when the player reaches the end of the level.
     */
    Victory() {
        this.state = this.PlayerState.VICTORY;
    }
}
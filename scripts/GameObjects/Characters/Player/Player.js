/**
 * @fileoverview Implements the player-controlled character (Foxy).
 * @module Player
 */

/**
 * The player-controlled character.
 * Extends {@link Character} with movement, jumping, shooting,
 * collision handling, animations and player state management.
 * Reads input from {@link InputManager}.
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

        this.CreateAnimations();

        /**
         * Collision layer of the player.
         * @type {number}
         */
        this.layer = CollisionLayers.PLAYER;

        /**
         * Layers the player can collide with.
         * @type {number[]}
         */
        this.collidableLayers = [
            CollisionLayers.ENEMY,
            CollisionLayers.PICKUP,
            CollisionLayers.GOAL
        ];

        /**
         * Maximum health of the player.
         * @type {number}
         */
        this.maxHealth = 5;

        /**
         * Current health of the player.
         * @type {number}
         */
        this.health = 5;

        /**
         * Current player state.
         * @type {string}
         */
        this.state = this.PlayerState.IDLE;

        /**
         * Time the player has remained idle.
         * @type {number}
         */
        this.idleTime = 0;

        /**
         * Time until long idle animation starts.
         * @type {number}
         */
        this.longIdleTime = 5;

        /**
         * Vertical movement velocity.
         * @type {number}
         */
        this.velocityY = 0;

        /**
         * Indicates whether the player is standing on the ground.
         * @type {boolean}
         */
        this.isGrounded = true;

        /**
         * Horizontal movement speed.
         * @type {number}
         */
        this.speed = 170;

        /**
         * Jump force applied when jumping.
         * @type {number}
         */
        this.jumpSpeed = 13;

        /**
         * Gravity force applied while falling.
         * @type {number}
         */
        this.gravity = 30;

        /**
         * Time between two shots.
         * @type {number}
         */
        this.shootCooldown = 0.5;

        /**
         * Indicates whether shooting is currently blocked by cooldown.
         * @type {boolean}
         */
        this.isShootOnCooldown = false;

        /**
         * Current elapsed cooldown time.
         * @type {number}
         */
        this.currentCooldownTime = 0;

        /**
         * Indicates whether the player is facing left.
         * @type {boolean}
         */
        this.isMovingLeft = false;

        /**
         * Movement amount during the current frame.
         * @type {number}
         */
        this.moveAmount = 0;

        /**
         * Amount of collected gems.
         * @type {number}
         */
        this.gemsCollected = 0;

        /**
         * Amount of collected cherries.
         * @type {number}
         */
        this.cherriesCollected = 0;

        /**
         * Reusable projectile pool.
         * @type {Projectile[]}
         */
        this.projectilePool = projectilePool;

        /**
         * Collision offset for more accurate hit detection.
         * @type {{top:number,bottom:number,left:number,right:number}}
         */
        this.collisionOffset = {
            top: 20,
            bottom: 20,
            left: 10,
            right: 20
        };

        /**
         * Jump animation sprites.
         */
        this.jumpImg1 = new Image();
        this.jumpImg1.src = SpriteAssets.PLAYER.JUMP_1;

        this.jumpImg2 = new Image();
        this.jumpImg2.src = SpriteAssets.PLAYER.JUMP_2;

        /**
         * Player death sprite.
         */
        this.playerDeadImg = new Image();
        this.playerDeadImg.src = SpriteAssets.PLAYER.DEAD;

        /**
         * Player victory sprite.
         */
        this.playerVictoryImg = new Image();
        this.playerVictoryImg.src = SpriteAssets.PLAYER.VICTORY;
    }

    /**
     * Handles the beginning of a collision.
     * Collects pickups and receives damage from enemies.
     * @param {GameObject} collider - Object that started the collision.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);

        if (collider instanceof Cherry) {
            this.cherriesCollected += 1;
        }

        if (collider instanceof Gem) {
            this.gemsCollected += 1;
        }

        if (collider instanceof Minion) {
            this.TakeDamage(0.5);
        }

        if (collider instanceof Boss) {
            this.TakeDamage(1);
        }
    }

    /**
     * Updates the player every frame.
     * Handles input processing, movement, physics,
     * state updates, animation and rendering.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);

        this.moveAmount = 0;

        /**
         * Checks if the player reached ground level.
         */
        if (this.positionY >= Level.GROUND) {
            this.isGrounded = true;
        }

        /**
         * Ignore player controls after death or victory.
         */
        if (
            this.state !== this.PlayerState.DEAD &&
            this.state !== this.PlayerState.VICTORY
        ) {
            this.MoveRight(deltaTime);
            this.MoveLeft(deltaTime);
            this.Jump(deltaTime);
            this.Shoot(deltaTime);
        }

        this.ApplyGravity(deltaTime);
        this.SetPlayerState(deltaTime);
        this.Animate(deltaTime);
        this.DrawImage();
    }

    /**
     * Moves the player to the right.
     * Movement is performed while {@link InputManager.RIGHT}
     * is active.
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
     * Moves the player to the left.
     * Prevents the player from leaving the left world boundary.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    MoveLeft(deltaTime) {
        if (InputManager.LEFT) {
            this.moveAmount = deltaTime * this.speed;
            this.positionX -= this.moveAmount;

            if (this.positionX < 0) {
                this.positionX = 0;
            }

            this.isMovingLeft = true;
        }
    }

    /**
     * Makes the player jump.
     * A jump can only be performed while grounded
     * and when {@link InputManager.JUMP} is active.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    Jump(deltaTime) {
        if (this.isGrounded && InputManager.JUMP) {
            this.velocityY = this.jumpSpeed;
            this.isGrounded = false;

            AudioManager.Play(
                AudioAssets.JUMP,
                false
            );
        }
    }

    /**
     * Applies gravity to the player while airborne.
     * Prevents the player from falling below the level ground.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    ApplyGravity(deltaTime) {
        if (!this.isGrounded) {
            this.velocityY -= deltaTime * this.gravity;
            this.positionY -= this.velocityY;

            if (this.positionY > Level.GROUND) {
                this.positionY = Level.GROUND;
            }
        }
    }

    /**
     * Shoots a projectile if shooting input is active
     * and the cooldown has expired.
     * Uses the reusable projectile pool to find
     * an available projectile.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    Shoot(deltaTime) {
        if (InputManager.SHOOT) {
            if (!this.isShootOnCooldown) {
                this.projectilePool.some(projectile => {
                    if (!projectile.isBeingShot) {
                        projectile.Shoot(
                            this.positionX + (this.isMovingLeft ? -15 : 25),
                            this.positionY + 25,
                            this.isMovingLeft ? -1 : 1
                        );

                        return true;
                    } else {
                        return false;
                    }
                });

                this.isShootOnCooldown = true;
            }
        }

        if (this.isShootOnCooldown) {
            this.currentCooldownTime += deltaTime;

            if (this.currentCooldownTime >= this.shootCooldown) {
                this.currentCooldownTime = 0;
                this.isShootOnCooldown = false;
            }
        }
    }

    /**
     * Updates the current player state.
     * The state depends on movement input,
     * grounded status and idle duration.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    SetPlayerState(deltaTime) {
        /**
         * Victory state overrides all other states.
         */
        if (this.state == this.PlayerState.VICTORY) {
            return;
        }

        if (this.isGrounded) {
            if (InputManager.LEFT || InputManager.RIGHT) {
                this.state = this.PlayerState.RUN;
            } else {
                this.idleTime += deltaTime;
                if (this.idleTime < this.longIdleTime) {
                    this.state = this.PlayerState.IDLE;
                } else {
                    this.state = this.PlayerState.LONG_IDLE;
                }
            }
        } else {
            this.state = this.PlayerState.JUMP;
        }

        if (this.isDead) {
            this.state = this.PlayerState.DEAD;
        }

        /**
         * Reset idle timer when player performs an action.
         */
        if (
            this.state !== this.PlayerState.IDLE &&
            this.state !== this.PlayerState.LONG_IDLE
        ) {
            this.idleTime = 0;
        }
    }

    /**
     * Updates the current animation frame depending on player state.
     * Handles idle, running, jumping, death and victory animations.
     * @param {number} deltaTime - Time since the last frame in seconds.
     */
    Animate(deltaTime) {
        super.Animate(deltaTime);

        switch (this.state) {
            case this.PlayerState.IDLE:
                this.SetAnimationFrame(
                    this.idle.nextFrame(deltaTime)
                );
                break;

            case this.PlayerState.LONG_IDLE:
                this.SetAnimationFrame(
                    this.longIdle.nextFrame(deltaTime)
                );
                break;

            case this.PlayerState.RUN:
                this.SetAnimationFrame(
                    this.run.nextFrame(deltaTime)
                );
                break;

            case this.PlayerState.JUMP:
                /**
                 * Uses different sprites depending on whether
                 * the player is moving upwards or downwards.
                 */
                this.SetAnimationFrame(
                    this.velocityY > 0
                        ? this.jumpImg1
                        : this.jumpImg2
                );
                break;

            case this.PlayerState.DEAD:
                this.SetAnimationFrame(
                    this.playerDeadImg
                );
                break;

            case this.PlayerState.VICTORY:
                this.SetAnimationFrame(
                    this.playerVictoryImg
                );
                break;

            default:
                this.SetAnimationFrame(
                    this.idle.nextFrame(deltaTime)
                );
                break;
        }
    }

    /**
     * Draws the player sprite onto the canvas.
     * The sprite is horizontally flipped when the player
     * is facing left.
     */
    DrawImage() {
        if (this.isMovingLeft) {
            this.context.save();
            /**
             * Flip rendering direction horizontally.
             */
            this.context.translate(this.sizeX, 0);
            this.context.scale(-1, 1);

            /**
             * Temporarily invert X position because
             * the canvas transformation changes coordinates.
             */
            this.positionX *= -1;
        }

        this.context.drawImage(
            this.img,
            this.positionX,
            this.positionY,
            this.sizeX,
            this.sizeY
        );

        if (this.isMovingLeft) {
            /**
             * Restore original position and canvas state.
             */
            this.positionX *= -1;
            this.context.restore();
        }
    }

    /**
     * Sets the player state to victory.
     * Called by {@link Goal} when the player reaches
     * the end of the level.
     */
    Victory() {
        this.state = this.PlayerState.VICTORY;
    }

    /**
     * Creates all player animations.
     * Initializes hurt, idle, long idle and running animations.
     */
    CreateAnimations() {
        /**
         * Hurt animation.
         */
        this.hurt = new Animation([
            SpriteAssets.PLAYER.HURT_1,
            SpriteAssets.PLAYER.HURT_2
        ]);

        /**
         * Normal idle animation.
         */
        this.idle = new Animation([
            SpriteAssets.PLAYER.IDLE_1,
            SpriteAssets.PLAYER.IDLE_2,
            SpriteAssets.PLAYER.IDLE_3,
            SpriteAssets.PLAYER.IDLE_4
        ]);

        /**
         * Extended idle animation.
         * Played after the player remains inactive
         * for a longer time.
         */
        this.longIdle = new Animation([
            SpriteAssets.PLAYER.LONG_IDLE_1,
            SpriteAssets.PLAYER.LONG_IDLE_2
        ]);

        /**
         * Running animation.
         */
        this.run = new Animation([
            SpriteAssets.PLAYER.RUN_1,
            SpriteAssets.PLAYER.RUN_2,
            SpriteAssets.PLAYER.RUN_3,
            SpriteAssets.PLAYER.RUN_4,
            SpriteAssets.PLAYER.RUN_5,
            SpriteAssets.PLAYER.RUN_6
        ]);
    }
}
/**
 * @fileoverview Handles all animation logic for the Player character.
 * @module PlayerAnimator
 */

/**
 * Manages animation state and frame selection for the {@link Player}.
 * Initialized with a reference to the player's {@link PlayerState} enum
 * and calls {@link Player#SetAnimationFrame} each tick.
 */
class PlayerAnimator {

    /**
     * Creates a new PlayerAnimator and initializes all animations.
     * @param {Player} player - The player instance this animator belongs to.
     */
    constructor(player) {
        this.player = player;
        this.CreateAnimations();
    }

    /**
     * Selects and applies the correct animation frame based on the current player state.
     * @param {number} deltaTime - Time since the last frame in seconds.
     * @param {string} state - The current player state from {@link Player#PlayerState}.
     * @param {number} velocityY - The player's current vertical velocity, used to select jump frames.
     */
    Update(deltaTime, state, velocityY) {
        const P = this.player.PlayerState;
        switch (state) {
            case P.IDLE:        this.player.SetAnimationFrame(this.idle.nextFrame(deltaTime)); break;
            case P.LONG_IDLE:   this.player.SetAnimationFrame(this.longIdle.nextFrame(deltaTime)); break;
            case P.RUN:         this.player.SetAnimationFrame(this.run.nextFrame(deltaTime)); break;
            case P.HURT:        this.player.SetAnimationFrame(this.hurt.nextFrame(deltaTime)); break;
            case P.DEAD:        this.player.SetAnimationFrame(this.playerDeadImg); break;
            case P.VICTORY:     this.player.SetAnimationFrame(this.playerVictoryImg); break;
            case P.JUMP:        this.player.SetAnimationFrame(velocityY > 0 ? this.jumpImg1 : this.jumpImg2); break;
            default:            this.player.SetAnimationFrame(this.idle.nextFrame(deltaTime)); break;
        }
    }

    /**
     * Initializes all animations and static sprites used by the player.
     * Delegates to {@link PlayerAnimator#CreateIdleAnimations} and
     * {@link PlayerAnimator#CreateMovementAnimations}.
     */
    CreateAnimations() {
        this.CreateIdleAnimations();
        this.CreateMovementAnimations();

        this.jumpImg1 = new Image();
        this.jumpImg1.src = SpriteAssets.PLAYER.JUMP_1;

        this.jumpImg2 = new Image();
        this.jumpImg2.src = SpriteAssets.PLAYER.JUMP_2;

        this.playerDeadImg = new Image();
        this.playerDeadImg.src = SpriteAssets.PLAYER.DEAD;

        this.playerVictoryImg = new Image();
        this.playerVictoryImg.src = SpriteAssets.PLAYER.VICTORY;
    }

    /**
     * Initializes idle, long idle and hurt animations.
     */
    CreateIdleAnimations() {
        this.idle = new Animation([
            SpriteAssets.PLAYER.IDLE_1,
            SpriteAssets.PLAYER.IDLE_2,
            SpriteAssets.PLAYER.IDLE_3,
            SpriteAssets.PLAYER.IDLE_4
        ]);

        this.longIdle = new Animation([
            SpriteAssets.PLAYER.LONG_IDLE_1,
            SpriteAssets.PLAYER.LONG_IDLE_2
        ]);

        this.hurt = new Animation([
            SpriteAssets.PLAYER.HURT_1,
            SpriteAssets.PLAYER.HURT_2
        ]);
    }

    /**
     * Initializes the running animation.
     */
    CreateMovementAnimations() {
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
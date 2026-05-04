class Player extends Character {

    PlayerState = Object.freeze({
        IDLE: "idle",
        RUN: "run",
        JUMP: "jump"
    });

    speed = .1;

    //cooldown class? timer class?
    shootCooldown = 1;
    isShootOnCooldown = false;
    currentCooldownTime = 0;

    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(positionX, positionY, sizeX, sizeY);
        this.context = context;
        this.CreateAnimations();

        this.state = this.PlayerState.IDLE;
        this.velocityY = 0;
        this.isGrounded = true;
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);

        if (InputManager.RIGHT) {
            this.positionX += deltaTime * this.speed;
        }

        if (InputManager.LEFT) {
            this.positionX -= deltaTime * this.speed;
        }

        if (InputManager.JUMP) {
            this.velocityY = deltaTime * this.speed;
            this.positionY -= this.velocityY;
            this.isGrounded = false;
        } else {
            this.velocityY = -deltaTime * this.speed;
            this.positionY -= this.velocityY;
        }

        if (this.isGrounded) {
            if (InputManager.LEFT || InputManager.RIGHT) {
                this.state = this.PlayerState.RUN;
            } else {
                this.state = this.PlayerState.IDLE;
            }
        } else {
            this.state = this.PlayerState.JUMP;
        }

        this.Animate(frame);

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    Animate(frame) {
        super.Animate(frame);

        if (this.state == this.PlayerState.IDLE) this.setAnimationFrame(this.idle.nextFrame());
        if (this.state == this.PlayerState.RUN) this.setAnimationFrame(this.run.nextFrame());
        if (this.state == this.PlayerState.JUMP) {
            if (this.velocityY > 0) {
                this.setAnimationFrame(SpriteAssets.PLAYER.JUMP_1);
            } else {
                this.setAnimationFrame(SpriteAssets.PLAYER.JUMP_2);
            }
        }
    }

    CreateAnimations() {
        this.idle = new Animation([
            SpriteAssets.PLAYER.IDLE_1,
            SpriteAssets.PLAYER.IDLE_2,
            SpriteAssets.PLAYER.IDLE_3,
            SpriteAssets.PLAYER.IDLE_4,
        ]);

        this.run = new Animation([
            SpriteAssets.PLAYER.RUN_1,
            SpriteAssets.PLAYER.RUN_2,
            SpriteAssets.PLAYER.RUN_3,
            SpriteAssets.PLAYER.RUN_4,
            SpriteAssets.PLAYER.RUN_5,
            SpriteAssets.PLAYER.RUN_6
        ])
    }
}
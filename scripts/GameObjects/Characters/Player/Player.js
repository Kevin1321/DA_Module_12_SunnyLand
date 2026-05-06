class Player extends Character {

    PlayerState = Object.freeze({
        IDLE: "idle",
        RUN: "run",
        JUMP: "jump"
    });

    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.CreateAnimations();

        this.state = this.PlayerState.IDLE;
        this.velocityY = 0;
        this.isGrounded = true;

        this.speed = .1;
        this.jumpSpeed = .3;
        this.shootCooldown = 1;
        this.isShootOnCooldown = false;
        this.currentCooldownTime = 0;
        this.isMovingLeft = false;
        this.moveAmount = 0;
    }

    OnTick(frame, deltaTime) {
        this.moveAmount = 0;
        if(this.positionY >= 336) this.isGrounded = true;
        this.MoveRight(deltaTime);
        this.MoveLeft(deltaTime);
        this.Jump(deltaTime);
        this.Shoot(deltaTime);
        this.SetPlayerState();
        this.Animate(frame);
        this.DrawImage();

        super.OnTick(frame, deltaTime); //todo, set back to head of the method! this is only for rendering debug rect
    }

    MoveRight(deltaTime) {
        if (InputManager.RIGHT) {
            this.moveAmount = deltaTime * this.speed;
            this.positionX += this.moveAmount;
            this.isMovingLeft = false;
        }
    }

    MoveLeft(deltaTime) {
        if (InputManager.LEFT) {
            this.moveAmount = deltaTime * this.speed;
            this.positionX -= this.moveAmount;
            if(this.positionX < 0) this.positionX = 0;
            this.isMovingLeft = true;
        }
    }

    Jump(deltaTime) {
        if (InputManager.JUMP) {
            this.velocityY = deltaTime * this.jumpSpeed;
            this.positionY -= this.velocityY;
            this.isGrounded = false;
        }
        else {
            if (!this.isGrounded) {
                this.velocityY = -deltaTime * this.jumpSpeed;
                this.positionY -= this.velocityY;
            }
        }
    }

    Shoot(deltaTime) {

    }

    SetPlayerState() {
        if (this.isGrounded) {
            if (InputManager.LEFT || InputManager.RIGHT) {
                this.state = this.PlayerState.RUN;
            }
            else {
                this.state = this.PlayerState.IDLE;
            }
        }
        else {
            this.state = this.PlayerState.JUMP;
        }
    }

    Animate(frame) {
        super.Animate(frame);
        
        if (this.state == this.PlayerState.IDLE) this.SetAnimationFrame(this.idle.nextFrame());
        if (this.state == this.PlayerState.RUN) this.SetAnimationFrame(this.run.nextFrame());
        if (this.state == this.PlayerState.JUMP) {
            if (this.velocityY > 0) {
                this.SetAnimationFrame(SpriteAssets.PLAYER.JUMP_1);
            }
            else {
                this.SetAnimationFrame(SpriteAssets.PLAYER.JUMP_2);
            }
        }
    }

    DrawImage() {
        if (this.isMovingLeft) {
            this.context.save();
            this.context.translate(this.img.width, 0);
            this.context.scale(-1, 1);
            this.positionX *= -1;
        }

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);

        if (this.isMovingLeft) {
            this.positionX *= -1;
            this.context.restore();
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
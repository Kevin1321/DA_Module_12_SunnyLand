class Player extends Character {
    PlayerState = Object.freeze({
        IDLE: "idle",
        LONG_IDLE: "longIdle",
        RUN: "run",
        JUMP: "jump",
        DEAD: "dead"
    });

    constructor(context, positionX, positionY, sizeX, sizeY, projectilePool) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();

        this.maxHealth = 5;
        this.health = 5;
        this.state = this.PlayerState.IDLE;
        this.idleTime = 0;
        this.longIdleTime = 10;
        this.velocityY = 0;
        this.isGrounded = true;
        this.speed = 120;
        this.jumpSpeed = 40;
        this.gravity = 50;
        this.shootCooldown = 1;
        this.isShootOnCooldown = false;
        this.currentCooldownTime = 0;
        this.isMovingLeft = false;
        this.moveAmount = 0;
        this.gemsCollected = 0;
        this.cherriesCollected = 0;
        this.projectilePool = projectilePool;
    }

    OnCollisionEnter(collider) {
        if (collider instanceof Cherry) {
            //console.log('cherry enter');
            this.cherriesCollected += 1;
            //console.log('Collected: ' + this.cherriesCollected);
        }

        if (collider instanceof Gem) {
            //console.log('gem enter')
            this.gemsCollected += 1;
            //console.log('Collected: ' + this.gemsCollected);
        }

        if (collider instanceof Enemy) {
            //console.log('Enemy enter');
            if (collider instanceof Minion) this.TakeDamage(.5);
            if (collider instanceof Boss) this.TakeDamage(1);
            //console.log('Current Health: ' + this.health);
        }
    }

    OnTick(frame, deltaTime) {
        this.moveAmount = 0;
        if (this.positionY >= Level.GROUND) this.isGrounded = true;
        if (!this.isDead) {
            this.MoveRight(deltaTime);
            this.MoveLeft(deltaTime);
            this.Jump(deltaTime);
            this.Shoot(deltaTime);
        }
        this.ApplyGravity(deltaTime);
        this.SetPlayerState(deltaTime);
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
            if (this.positionX < 0) this.positionX = 0;
            this.isMovingLeft = true;
        }
    }

    Jump(deltaTime) {
        if (this.isGrounded && InputManager.JUMP) {
            this.velocityY = this.jumpSpeed;
            this.isGrounded = false;
        }
    }

    ApplyGravity(deltaTime) {
        if (!this.isGrounded) {
            this.velocityY -= deltaTime * this.gravity;
            this.positionY -= this.velocityY;
            if (this.positionY > Level.GROUND) this.positionY = Level.GROUND;
        }
    }

    Shoot(deltaTime) {
        if (InputManager.SHOOT) {
            if (!this.isShootOnCooldown) {
                this.projectilePool.some(projectile => {
                    if (!projectile.isBeingShot) {
                        projectile.Shoot((this.positionX + (this.isMovingLeft ? -15 : 25)), this.positionY + 25, this.isMovingLeft ? -1 : 1);
                        return true;
                    }
                    else {
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

    SetPlayerState(deltaTime) {
        if (this.isGrounded) {
            if (InputManager.LEFT || InputManager.RIGHT) {
                this.state = this.PlayerState.RUN;
            }
            else {    
                this.idleTime += deltaTime;
                if (this.idleTime < this.longIdleTime) {
                    this.state = this.PlayerState.IDLE;
                }
                else {
                    this.state = this.PlayerState.LONG_IDLE;
                }
            }
        }
        else {
            this.state = this.PlayerState.JUMP;
        }
        if (this.isDead) {
            this.state = this.PlayerState.DEAD;
        }        
        if (this.state != this.PlayerState.IDLE && this.state != this.PlayerState.LONG_IDLE) this.idleTime = 0;
    }

    Animate(frame) {
        super.Animate(frame);
        if (this.state == this.PlayerState.IDLE) this.SetAnimationFrame(this.idle.nextFrame());
        if (this.state == this.PlayerState.LONG_IDLE) this.SetAnimationFrame(this.longIdle.nextFrame());
        if (this.state == this.PlayerState.RUN) this.SetAnimationFrame(this.run.nextFrame());
        if (this.state == this.PlayerState.JUMP) {
            if (this.velocityY > 0) {
                this.SetAnimationFrame(SpriteAssets.PLAYER.JUMP_1);
            }
            else {
                this.SetAnimationFrame(SpriteAssets.PLAYER.JUMP_2);
            }
        }
        if (this.state == this.PlayerState.DEAD) this.SetAnimationFrame(SpriteAssets.PLAYER.DEAD);
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
        this.hurt = new Animation([
            SpriteAssets.PLAYER.HURT_1,
            SpriteAssets.PLAYER.HURT_2
        ]);

        this.idle = new Animation([
            SpriteAssets.PLAYER.IDLE_1,
            SpriteAssets.PLAYER.IDLE_2,
            SpriteAssets.PLAYER.IDLE_3,
            SpriteAssets.PLAYER.IDLE_4,
        ]);

        this.longIdle = new Animation([
            SpriteAssets.PLAYER.LONG_IDLE_1,
            SpriteAssets.PLAYER.LONG_IDLE_2
        ]);

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
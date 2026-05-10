class Minion extends Enemy {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();

        this.state = this.EnemyState.IDLE;
        this.health = 1;
        this.speed = 30;
        this.isMovingRight = false;
        this.direction = -1;
        this.timeOut = Util.GetRandomRange(3000, 6000);
        this.collisionOffset = {
            top: 20,
            bottom: 20,
            left: 15,
            right: 15
        }
        setTimeout(() => this.SwitchDirection(), this.timeOut);
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
        if (this.state == this.EnemyState.MOVE) this.Move(deltaTime);
        this.Animate(frame);
        this.DrawImage();
    }

    Move(deltaTime) {
        this.positionX += this.speed * this.direction * deltaTime;
    }

    Animate(frame) {
        super.Animate(frame);
        if (this.state == this.EnemyState.IDLE) this.SetAnimationFrame(this.idle.nextFrame());
        if (this.state == this.EnemyState.MOVE) this.SetAnimationFrame(this.move.nextFrame());
    }

    DrawImage() {
        if (this.isMovingRight) {
            this.context.save();
            this.context.translate(this.img.width, 0);
            this.context.scale(-1, 1);
            this.positionX *= -1;
        }

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);

        if (this.isMovingRight) {
            this.positionX *= -1;
            this.context.restore();
        }
    }

    SwitchDirection() {
        this.state = this.EnemyState.MOVE;

        if (this.isMovingRight) {
            this.isMovingRight = false;
            this.direction = -1;
        }
        else {
            this.isMovingRight = true;
            this.direction = 1;
        }

        setTimeout(() => this.Idle(), this.timeOut);
    }

    Idle() {
        this.state = this.EnemyState.IDLE;

        setTimeout(() => this.SwitchDirection(), this.timeOut);
    }



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
    }
}
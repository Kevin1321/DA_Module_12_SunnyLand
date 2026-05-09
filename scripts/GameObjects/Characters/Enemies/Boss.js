class Boss extends Enemy {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();
        this.state = this.EnemyState.IDLE;
        this.health = 5;
        this.speed = 40;
        this.xDirection = -1;
        this.yDirection = -1;
        this.timeOut = 4000;
        this.BeginFight();
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
        if (this.state == this.EnemyState.MOVE) this.Move(deltaTime);
        this.Animate(frame);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    Move(deltaTime) {
        this.positionX += this.speed * this.xDirection * deltaTime;
        this.positionX = Util.Clamp(this.positionX, World.WORLD_BOUNDS.minX, World.WORLD_BOUNDS.maxX - this.sizeX);
        this.positionY += this.speed * this.yDirection * deltaTime;
        this.positionY = Util.Clamp(this.positionY, World.WORLD_BOUNDS.minY, World.WORLD_BOUNDS.maxY);
    }

    Animate(frame) {
        super.Animate(frame);
        if (this.state == this.EnemyState.IDLE) this.SetAnimationFrame(this.idle.nextFrame());
        if (this.state == this.EnemyState.MOVE) this.SetAnimationFrame(this.flying.nextFrame());
    }

    BeginFight() {
        this.state = this.EnemyState.MOVE;
        this.SwitchDirection();
    }

    SwitchDirection() {
        this.xDirection = Util.GetRandomNormalized();
        this.yDirection = Util.GetRandomNormalized();
        setTimeout(() => this.SwitchDirection(), this.timeOut);
    }

    CreateAnimations() {
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
        ])
    }
}
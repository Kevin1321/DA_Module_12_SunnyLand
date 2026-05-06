class Boss extends Enemy {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);

        this.Animate(frame);

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    Animate(frame) {
        super.Animate(frame);

        this.SetAnimationFrame(this.idle.nextFrame());
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
class Minion extends Enemy {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);

        this.Animate(frame);
        
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    Animate(frame){
        super.Animate(frame);

        this.SetAnimationFrame(this.idle.nextFrame());
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
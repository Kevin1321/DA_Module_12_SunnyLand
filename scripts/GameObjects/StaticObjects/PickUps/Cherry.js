class Cherry extends PickUp {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.idle = new Animation([
            SpriteAssets.PICK_UPS.CHERRY_1,
            SpriteAssets.PICK_UPS.CHERRY_2,
            SpriteAssets.PICK_UPS.CHERRY_3,
            SpriteAssets.PICK_UPS.CHERRY_4,
            SpriteAssets.PICK_UPS.CHERRY_5,
            SpriteAssets.PICK_UPS.CHERRY_6,
            SpriteAssets.PICK_UPS.CHERRY_7
        ]);
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
        this.SetAnimationFrame(this.idle.nextFrame());

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
class Gem extends PickUp {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(positionX, positionY, sizeX, sizeY);
        this.context = context;

        this.idle = new Animation([
            SpriteAssets.PICK_UPS.GEM_1,
            SpriteAssets.PICK_UPS.GEM_2,
            SpriteAssets.PICK_UPS.GEM_3,
            SpriteAssets.PICK_UPS.GEM_4,
            SpriteAssets.PICK_UPS.GEM_5
        ]);
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
   
        this.setAnimationFrame(this.idle.nextFrame());

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
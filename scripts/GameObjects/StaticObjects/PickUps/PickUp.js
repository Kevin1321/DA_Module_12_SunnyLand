class PickUp extends GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.PICKUP;
        this.collidableLayers = [CollisionLayers.PLAYER];

        this.isActive = true;
        this.hasBeenPickedUp = false;

        this.pickedUp = new Animation([
            SpriteAssets.VFX.ITEM_FEEDBACK_1,
            SpriteAssets.VFX.ITEM_FEEDBACK_2,
            SpriteAssets.VFX.ITEM_FEEDBACK_3,
            SpriteAssets.VFX.ITEM_FEEDBACK_4
        ]);

        this.pickedUp.addEventListener("EndOfAnimation", this.OnEndOfAnimation);
    }

    OnTick(deltaTime) {
        super.OnTick(deltaTime);
    }

    OnCollisionEnter(collider) {
        super.OnCollision(collider);
    }

    OnEndOfAnimation = () => {
        this.isActive = false;
        this.positionX = -500;
        this.positionY = -500;
    }
}
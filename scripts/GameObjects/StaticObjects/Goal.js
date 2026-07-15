class Goal extends GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.GOAL;
        this.collidableLayers = [CollisionLayers.PLAYER];

        this.img.src = imgSrc;
    }

    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    OnCollisionEnter(collider) {
        super.OnCollision(collider);

        if (collider instanceof Player) {
            collider.Victory();
        }
    }
}
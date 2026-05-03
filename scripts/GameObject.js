class GameObject {
    constructor(positionX, positionY, sizeX, sizeY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.img = new Image(this.sizeY, this.sizeX);
    }

    OnTick(frame, deltaTime) {
    }
}
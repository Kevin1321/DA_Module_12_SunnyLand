class GameObject {
    constructor(positionX, positionY, sizeX, sizeY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.transform = new Transform(new Vector2(this.positionX, this.positionY), new Vector2(this.sizeX, this.sizeY));
        this.img = new Image(this.sizeY, this.sizeX);
    }

    OnTick(deltaTime) {
        
    }
}
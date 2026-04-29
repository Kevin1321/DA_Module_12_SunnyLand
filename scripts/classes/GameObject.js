class GameObject {
    constructor(positionX, positionY, sizeX, sizeY) {
        this.transform = new Transform(new Vector2(positionX, positionY), new Vector2(sizeX, sizeY));
        this.img = new Image(this.sizeY, this.sizeX);
    }

    setImageByPath(path) {
        this.img.src = path;
    }

    OnTick(deltaTime) {
        
    }
}
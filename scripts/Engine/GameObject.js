class GameObject {
    constructor(positionX, positionY, sizeX, sizeY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.img = new Image(this.sizeY, this.sizeX);
    }

    setAnimationFrame(animationFrameSrc) {
        this.img.src = animationFrameSrc;
    }

    OnTick(frame, deltaTime) {
    }
}
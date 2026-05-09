class Level extends GameObject {
    static GROUND = 336;

    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        
        this.img.src = imgSrc;
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
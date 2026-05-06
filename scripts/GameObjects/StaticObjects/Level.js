class Level extends GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        
        this.img.src = imgSrc;
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
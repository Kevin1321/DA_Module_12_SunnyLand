class Prop extends GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
        this.context = context;
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
class Character extends GameObject{
    constructor(positionX, positionY, sizeX, sizeY){
        super(positionX, positionY, sizeX, sizeY);
    }

    setAnimationFrame(frame){
        this.img.src = frame;
    }

    OnTick(deltaTime){
        super.OnTick(deltaTime);
    }
}
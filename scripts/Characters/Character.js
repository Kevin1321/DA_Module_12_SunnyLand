class Character extends GameObject{
    constructor(positionX, positionY, sizeX, sizeY){
        super(positionX, positionY, sizeX, sizeY);
    }

    setAnimationFrame(animationFrameSrc){
        this.img.src = animationFrameSrc;
    }

    OnTick(frame, deltaTime){
        super.OnTick(frame, deltaTime);
    }
}
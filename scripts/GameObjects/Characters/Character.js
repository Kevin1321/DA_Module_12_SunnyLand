class Character extends GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
    }

    Animate(frame) {
        if(frame % 2 != 0) return;
    }
}
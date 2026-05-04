class Character extends GameObject {
    constructor(positionX, positionY, sizeX, sizeY) {
        super(positionX, positionY, sizeX, sizeY);
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
    }

    Animate(frame) {
        if(frame % 2 != 0) return;
    }
}
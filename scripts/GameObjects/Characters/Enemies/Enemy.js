class Enemy extends Character {
    EnemyState = Object.freeze({
        IDLE: "idle",
        MOVE: "move",
        ATTACK: "attack"
    });

    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
    }

    Animate(frame) {
        super.Animate(frame);
    }
}
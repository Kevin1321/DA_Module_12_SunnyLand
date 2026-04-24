class Enemy extends MovableObject {
    constructor(x, y) {
        super().loadImage("assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle1.png");

        this.x = x;
        this.y = y;
    }
}
class Minion extends Enemy {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(positionX, positionY, sizeX, sizeY);
        this.context = context;

        this.CreateAnimations();
    }

    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.setAnimationFrame(this.idle.nextFrame());

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    CreateAnimations() {
        this.idle = new Animation([
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle1.png",
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle2.png",
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle3.png",
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle4.png",
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle5.png",
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle6.png",
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle7.png",
            "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle8.png"
        ]);
    }
}
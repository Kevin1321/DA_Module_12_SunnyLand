class Player extends Character {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(positionX, positionY, sizeX, sizeY);
        this.context = context;

        this.CreateAnimations();
    }

    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        console.log(InputManager.RIGHT);
        this.setAnimationFrame(this.idle.nextFrame());
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    CreateAnimations() {
        this.idle = new Animation([
            "assets/sprites/characters/Foxy/idle/player-idle-1.png",
            "assets/sprites/characters/Foxy/idle/player-idle-2.png",
            "assets/sprites/characters/Foxy/idle/player-idle-3.png",
            "assets/sprites/characters/Foxy/idle/player-idle-4.png"
        ]);
    }
}
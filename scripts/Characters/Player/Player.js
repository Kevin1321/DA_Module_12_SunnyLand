class Player extends Character {

    //state = ;

    speed = .1;

    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(positionX, positionY, sizeX, sizeY);
        this.context = context;
        this.CreateAnimations();
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
        if (InputManager.RIGHT) {
            this.positionX += deltaTime * this.speed;
        }
        if (InputManager.LEFT) {
            this.positionX -= deltaTime * this.speed;
        }
        this.Animate(frame);

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    Animate(frame) {
        if (frame % 2 == 1) return;
        //if()
        this.setAnimationFrame(this.idle.nextFrame());
    }

    CreateAnimations() {
        this.idle = new Animation([
            "assets/sprites/characters/Foxy/idle/player-idle-1.png",
            "assets/sprites/characters/Foxy/idle/player-idle-2.png",
            "assets/sprites/characters/Foxy/idle/player-idle-3.png",
            "assets/sprites/characters/Foxy/idle/player-idle-4.png"
        ]);

        this.run = new Animation([
            "assets/sprites/characters/Foxy/run/player-run-1.png",
            "assets/sprites/characters/Foxy/run/player-run-2.png",
            "assets/sprites/characters/Foxy/run/player-run-3.png",
            "assets/sprites/characters/Foxy/run/player-run-4.png",
            "assets/sprites/characters/Foxy/run/player-run-5.png",
            "assets/sprites/characters/Foxy/run/player-run-6.png"
        ])
    }
}
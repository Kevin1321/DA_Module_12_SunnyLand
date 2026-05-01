class World {
    context;
    lastTime;
    requiredElapsed = 1000 / 8;
    gameObjects = [];

    constructor(canvas) {
        this.context = canvas.getContext('2d');
        this.Tick = this.Tick.bind(this);
        this.Tick();
        this.CreateGameObjects();
    }

    Tick(now) {
        requestAnimationFrame(this.Tick);

        if (!this.lastTime) {
            this.lastTime = now;
        }

        let deltaTime = now - this.lastTime;

        if (deltaTime > this.requiredElapsed) {
            this.OnTick(deltaTime);
            this.lastTime = now;
        }
    }

    OnTick(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.OnTick(deltaTime);
        });
    }

    CreateGameObjects() {
        this.backgroundLayerOne = new Background(this.context, 0, 0, 720, 480, "assets/sprites/environments/Backgrounds/SunnyLandBase/back.png");

        this.middleOne = new Background(this.context, 0, 250, 176, 368, "assets/sprites/environments/Backgrounds/SunnyLandBase/middle.png");
        this.middleTwo = new Background(this.context, 176, 250, 176, 368, "assets/sprites/environments/Backgrounds/SunnyLandBase/middle.png");
        this.middleThree = new Background(this.context, 352, 250, 176, 368, "assets/sprites/environments/Backgrounds/SunnyLandBase/middle.png");
        this.middleFour = new Background(this.context, 528, 250, 176, 368, "assets/sprites/environments/Backgrounds/SunnyLandBase/middle.png");
        this.middleFive = new Background(this.context, 704, 250, 176, 368, "assets/sprites/environments/Backgrounds/SunnyLandBase/middle.png");

        this.level_1 = new Level(this.context, 0, 384, 720, 96, "assets/sprites/environments/Level/Level_1.png");

        this.woodenHouse = new Prop(this.context, 600, 302, 112, 98, "assets/sprites/environments/Props/wooden-house.png")
        //draw grass seperatly

        this.minion = new Minion(this.context, 200, 336, 64, 64);
        this.player = new Player(this.context, 0, 336, 64, 64);

        this.gameObjects.push(this.backgroundLayerOne);
        this.gameObjects.push(this.middleOne);
        this.gameObjects.push(this.middleTwo);
        this.gameObjects.push(this.middleThree);
        this.gameObjects.push(this.middleFour);
        this.gameObjects.push(this.middleFive);
        this.gameObjects.push(this.level_1);

        this.gameObjects.push(this.woodenHouse);

        this.gameObjects.push(this.player);
        this.gameObjects.push(this.minion);
    }
}
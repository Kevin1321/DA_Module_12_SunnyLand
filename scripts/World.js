class World {
    context;
    lastTime;
    requiredElapsed = 1000 / 15;
    gameObjects = [];
    frame = 0;

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
            gameObject.OnTick(this.frame, deltaTime);
        });

        this.frame++;
        if (this.frame == Infinity) this.frame = 0;
    }

    CreateGameObjects() {
        this.backgroundLayerOne = new Background(this.context, 0, 0, 720, 480, SpriteAssets.BACKGROUNDS.SUNNY_LAND_BASE);

        this.middleOne = new Background(this.context, 0, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE);
        this.middleTwo = new Background(this.context, 176, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE);
        this.middleThree = new Background(this.context, 352, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE);
        this.middleFour = new Background(this.context, 528, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE);
        this.middleFive = new Background(this.context, 704, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE);

        this.level_1 = new Level(this.context, 0, 384, 720, 96, SpriteAssets.LEVEL.LEVEL_1);

        this.woodenHouse = new Prop(this.context, 600, 302, 112, 98, SpriteAssets.PROPS.WOODEN_HOUSE);
        //todo: draw grass seperatly

        this.minion = new Minion(this.context, 200, 336, 64, 64);
        this.boss = new Boss(this.context, 250, 272, 128, 128);
        this.player = new Player(this.context, 0, 336, 64, 64);

        this.cherry_test = new Cherry(this.context, 100, 360, 32, 32);
        this.gem_test = new Gem(this.context, 164, 360, 32, 32);

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
        this.gameObjects.push(this.boss);

        this.gameObjects.push(this.cherry_test);
        this.gameObjects.push(this.gem_test);
    }

    CreateBackgrounds() {

    }

    CreateProps() {

    }

    CreatePickUps() {

    }
}
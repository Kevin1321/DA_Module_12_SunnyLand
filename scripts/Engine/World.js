class World {
    static WORLD_BOUNDS = {
        minX: 0,
        maxX: 720,
        minY: 0,
        maxY: 480
    }

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.lastTime;
        this.requiredElapsed = 0.1;
        this.gameObjects = [];
        this.collisionTracker = [];
        this.currentPlayerCollisions = [];
        this.frame = 0;

        this.camera = {
            x: 0,
            y: 0
        };

        this.Tick = this.Tick.bind(this);
        this.Tick();
        this.CreateGameObjects();
        AudioManager.Play(AudioAssets.BACKGROUND_MUSIC, true);
    }

    Tick(now) {
        requestAnimationFrame(this.Tick);

        if (!this.lastTime) {
            this.lastTime = now;
        }

        let deltaTime = (now - this.lastTime) / 1000;
        if (deltaTime > this.requiredElapsed) {
            this.OnTick(deltaTime);
            this.lastTime = now;
        }
    }

    UpdateCamera() {
        let xTranslation = this.player.positionX - this.canvas.width / 2 + this.player.sizeX / 2;
        if (xTranslation < 0) xTranslation = 0;
        this.camera.x = xTranslation;
        //this.camera.y = this.player.positionY - this.canvas.height / 2 + this.player.sizeY / 2;
    }

    OnTick(deltaTime) {
        this.UpdateCamera();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();

        this.context.translate(-this.camera.x, 0);

        this.UpdateGameObjects(deltaTime);

        this.UpdateUIObjects(deltaTime);

        this.CheckCollisions();

        this.context.restore();

        this.frame++;
        if (this.frame == Infinity) this.frame = 0;
    }

    UpdateGameObjects(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.OnTick(this.frame, deltaTime);
        });
    }

    UpdateUIObjects(deltaTime) {
        this.playerHUD.OnTick(this.frame, deltaTime);
    }

    IsColliding(a, b) {
        //todo add offset to GO and use it here
        return (
            a.positionX < b.positionX + b.sizeX &&
            a.positionX + a.sizeX > b.positionX &&
            a.positionY < b.positionY + b.sizeY &&
            a.positionY + a.sizeY > b.positionY
        );
    }

    CheckCollisions() {
        this.collisionTracker.forEach(collider => {
            if (this.IsColliding(this.player, collider)) {
                this.CheckCollisionEnter(collider);
                this.player.OnCollision(collider);
                collider.OnCollision(this.player);
            }
        });
        this.CheckCollisionExit();
    }

    CheckCollisionEnter(collider) {
        if (!this.currentPlayerCollisions.includes(collider)) {
            this.currentPlayerCollisions.push(collider);
            this.player.OnCollisionEnter(collider);
        }
    }

    CheckCollisionExit() {
        let temp = this.currentPlayerCollisions;

        temp.forEach(collider => {
            if (!this.IsColliding(this.player, collider)) {
                this.player.OnCollisionExit(collider);
                this.currentPlayerCollisions.splice(this.currentPlayerCollisions.indexOf(collider), 1);
            }
        });
    }

    CreateGameObjects() {
        this.CreateBackgrounds();
        this.CreateLevel();
        this.CreateProps();
        this.CreatePickUps();
        this.CreateEnemies();
        this.CreateProjectiles();
        this.CreatePlayer();
        //todo: draw grass seperatly
        this.CreateUI();
    }

    CreateBackgrounds() {
        this.gameObjects.push(
            this.backgroundLayerOne = new Background(this.context, 0, 0, 720, 480, SpriteAssets.BACKGROUNDS.SUNNY_LAND_BASE),
            this.middleOne = new Background(this.context, 0, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE),
            this.middleTwo = new Background(this.context, 176, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE),
            this.middleThree = new Background(this.context, 352, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE),
            this.middleFour = new Background(this.context, 528, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE),
            this.middleFive = new Background(this.context, 704, 250, 176, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE)
        );
    }

    CreateLevel() {
        this.gameObjects.push(this.level_1 = new Level(this.context, 0, 384, 720, 96, SpriteAssets.LEVEL.LEVEL_1));
    }

    CreateProps() {
        this.gameObjects.push(this.woodenHouse = new Prop(this.context, 600, 302, 112, 98, SpriteAssets.PROPS.WOODEN_HOUSE));
    }

    CreatePickUps() {
        this.gameObjects.push(
            this.cherry_test = new Cherry(this.context, 100, 360, 32, 32),
            this.gem_test = new Gem(this.context, 164, 360, 32, 32)
        );

        this.collisionTracker.push(
            this.cherry_test,
            this.gem_test
        );
    }

    CreateEnemies() {
        this.gameObjects.push(
            this.minion = new Minion(this.context, 200, 336, 64, 64),
            this.boss = new Boss(this.context, 400, 272, 128, 128)
        );

        this.collisionTracker.push(
            this.minion,
            this.boss
        );
    }

    CreateProjectiles() {
        this.projectilePool = [
            new Projectile(this.context, -500, -500, 32, 32),
            new Projectile(this.context, -500, -500, 32, 32),
            new Projectile(this.context, -500, -500, 32, 32),
            new Projectile(this.context, -500, -500, 32, 32),
            new Projectile(this.context, -500, -500, 32, 32),
            new Projectile(this.context, -500, -500, 32, 32),
            new Projectile(this.context, -500, -500, 32, 32)
        ]

        this.projectilePool.forEach(projectile => {
            this.gameObjects.push(projectile);
            this.collisionTracker.push(projectile);
        })
    }

    CreatePlayer() {
        this.gameObjects.push(this.player = new Player(this.context, 0, 336, 64, 64, this.projectilePool));
    }

    CreateUI() {
        this.playerHUD = new PlayerHUD(this.context, this.camera, this.player);
    }
}
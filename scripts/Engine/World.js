class World {
    static WORLD_BOUNDS = {
        minX: 0,
        maxX: 2880,
        minY: 0,
        maxY: 480
    }

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.lastTime;
        this.requiredElapsed = 0.1;
        this.gameObjects = [];
        this.frame = 0;

        this.camera = {
            x: 0,
            y: 0
        };

        this.Tick = this.Tick.bind(this);
        this.CreateGameObjects();
        this.Tick();
        AudioManager.Play(AudioAssets.BACKGROUND_MUSIC, true);
    }

    Tick(now) {
        requestAnimationFrame(this.Tick);

        if (!this.lastTime) {
            this.lastTime = now;
            return;
        }

        let deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;

        // FPS Counter
        this.frameCount = (this.frameCount || 0) + 1;
        this.fpsAccum = (this.fpsAccum || 0) + deltaTime;

        if (this.fpsAccum >= 1) {
            this.fps = Math.round(this.frameCount / this.fpsAccum);
            this.frameCount = 0;
            this.fpsAccum = 0;
            document.getElementById('fps').textContent = `FPS: ${this.fps}`;
        }

        this.OnTick(deltaTime);
    }

    UpdateCamera() {
        let xTranslation = this.player.positionX - this.canvas.width / 2 + this.player.sizeX / 2;

        if (xTranslation < World.WORLD_BOUNDS.minX) xTranslation = World.WORLD_BOUNDS.minX;
        if (xTranslation > World.WORLD_BOUNDS.maxX - 720) xTranslation = World.WORLD_BOUNDS.maxX - 720;
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

        this.StartBossFight();
    }

    UpdateGameObjects(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.OnTick(deltaTime);
        });
    }

    UpdateUIObjects(deltaTime) {
        this.playerHUD.OnTick(deltaTime);
    }

    IsColliding(a, b) {
        return (
            // A left < B right
            a.positionX + a.collisionOffset.left <
            b.positionX + b.sizeX - b.collisionOffset.right &&

            // A right > B left
            a.positionX + a.sizeX - a.collisionOffset.right >
            b.positionX + b.collisionOffset.left &&

            // A top < B bottom
            a.positionY + a.collisionOffset.top <
            b.positionY + b.sizeY - b.collisionOffset.bottom &&

            // A bottom > B top
            a.positionY + a.sizeY - a.collisionOffset.bottom >
            b.positionY + b.collisionOffset.top
        );
    }

    CheckCollisions() {
        // Alle aktiven Kollisionen dieser Frame sammeln
        const activeCollisions = new Map();

        for (let i = 0; i < this.gameObjects.length; i++) {
            const a = this.gameObjects[i];
            if (a.collidableLayers.length === 0) continue;

            for (let j = i + 1; j < this.gameObjects.length; j++) {
                const b = this.gameObjects[j];

                const aCanHitB = a.collidableLayers.includes(b.layer);
                const bCanHitA = b.collidableLayers.includes(a.layer);

                if (!aCanHitB && !bCanHitA) continue;
                if (!this.IsColliding(a, b)) continue;

                if (aCanHitB) this.RegisterCollision(activeCollisions, a, b);
                if (bCanHitA) this.RegisterCollision(activeCollisions, b, a);
            }
        }

        // Enter, Stay, Exit auflösen
        this.ResolveCollisions(activeCollisions);
    }

    RegisterCollision(activeCollisions, a, b) {
        if (!activeCollisions.has(a)) activeCollisions.set(a, new Set());
        activeCollisions.get(a).add(b);
    }

    ResolveCollisions(activeCollisions) {
        // Alle GameObjects durchgehen die collidable sind
        this.gameObjects.forEach(obj => {
            if (obj.collidableLayers.length === 0) return;

            const currentHits = activeCollisions.get(obj) ?? new Set();

            // OnCollision (Stay)
            currentHits.forEach(other => {
                obj.OnCollision(other);
            });

            // OnCollisionEnter
            currentHits.forEach(other => {
                if (!obj.currentCollisions.has(other)) {
                    obj.OnCollisionEnter(other);
                }
            });

            // OnCollisionExit
            obj.currentCollisions.forEach(other => {
                if (!currentHits.has(other)) {
                    obj.OnCollisionExit(other);
                }
            });

            // State updaten
            obj.currentCollisions = currentHits;
        });
    }

    CreateGameObjects() {
        this.CreateBackgrounds();
        this.CreateLevel();
        this.CreateProps();
        this.CreateGoal();
        this.CreatePickUps();
        this.CreateEnemies();
        this.CreateProjectiles();
        this.CreatePlayer();
        this.CreateGrass();
        this.CreateUI();
    }

    CreateBackgrounds() {
        for (let index = 0; index < 4; index++) {
            this.gameObjects.push(new Background(this.context, 720 * index, 0, 721, 480, SpriteAssets.BACKGROUNDS.SUNNY_LAND_BASE));
        }
        for (let index = 0; index < 17; index++) {
            this.gameObjects.push(new Background(this.context, 176 * index, 250, 177, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE));
        }
    }

    CreateLevel() {
        this.gameObjects.push(this.level_1 = new Level(this.context, 0, 400, 2880, 80, SpriteAssets.LEVEL.LEVEL_1));
    }
    CreateGrass() {
        this.gameObjects.push(this.level_1_grass = new Level(this.context, 0, 386, 2880, 16, SpriteAssets.LEVEL.LEVEL_1_GRASS));
    }

    CreateProps() {
        this.CreateProp(SpriteAssets.PROPS.TREE, 15, 79, 100, 176, 200);
        this.CreateProp(SpriteAssets.PROPS.ROCK_2, 7, 66, 80, 55, 70);
        this.CreateProp(SpriteAssets.PROPS.ROCK, 12, 28, 40, 15, 30);
        this.CreateProp(SpriteAssets.PROPS.SHROOMS, 30, 16, 20, 15, 20);
    }

    CreateProp(sprite, amount, minX, maxX, minY, maxY) {
        for (let index = 0; index < amount; index++) {
            let positionX = index * Util.GetRandomRange(200, 300) + Util.GetRandomRange(0, 500);
            let sizeX = Util.GetRandomRange(minX, maxX);
            let sizeY = Util.GetRandomRange(minY, maxY);
            let positionY = World.WORLD_BOUNDS.maxY - sizeY - this.level_1.sizeY;
            this.gameObjects.push(new Prop(this.context, positionX, positionY, sizeX, sizeY, sprite))
        }
    }

    CreateGoal() {
        this.gameObjects.push(this.woodenHouse = new Goal(this.context, 2760, 302, 112, 98, SpriteAssets.PROPS.WOODEN_HOUSE));
    }

    CreatePickUps() {
        for (let index = 0; index < 10; index++) {
            let cherry = new Cherry(this.context, index * 200 + Util.GetRandomRange(100, 400), 360, 32, 32);
            this.gameObjects.push(cherry);
        }

        for (let index = 0; index < 10; index++) {
            let gem = new Gem(this.context, index * 200 + Util.GetRandomRange(100, 400), 360, 32, 32);
            this.gameObjects.push(gem);
        }
    }

    CreateEnemies() {
        for (let index = 0; index < 5; index++) {
            let positionX = index * Util.GetRandomRange(200, 300) + Util.GetRandomRange(0, 500);
            let minion = new Minion(this.context, positionX, 336, 64, 64);

            this.gameObjects.push(minion);
        }

        this.gameObjects.push(this.boss = new Boss(this.context, 2560, 272, 128, 128));
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
        })
    }

    CreatePlayer() {
        this.gameObjects.push(this.player = new Player(this.context, 0, 336, 64, 64, this.projectilePool));
    }

    CreateUI() {
        this.playerHUD = new PlayerHUD(this.context, this.camera, this.player);
    }

    StartBossFight() {
        if (this.player.positionX >= 2420) this.boss.BeginFight();
    }
}
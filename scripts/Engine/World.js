/**
 * @fileoverview Manages the game world, all GameObjects, the camera, collisions, and the game state.
 * @module World
 */

/**
 * Represents the entire game world.
 * Responsible for the game loop, camera, collision detection, and management of all GameObjects.
 */
class World {

    /**
     * The boundaries of the game world in pixels.
     * @static
     * @type {{ minX: number, maxX: number, minY: number, maxY: number }}
     */
    static WORLD_BOUNDS = {
        minX: 0,
        maxX: 2880,
        minY: 0,
        maxY: 480
    }

    /**
     * Creates a new instance of the game world.
     * @param {HTMLCanvasElement} canvas - The canvas element on which the world is rendered.
     */
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

    /**
     * The main game loop. Called once per frame by the browser.
     * Calculates deltaTime and delegates execution to {@link World#OnTick}.
     * @param {DOMHighResTimeStamp} now - Timestamp of the current frame in milliseconds.
     */
    Tick(now) {
        this.rafId = requestAnimationFrame(this.Tick);

        if (!this.lastTime) {
            this.lastTime = now;
            return;
        }

        let deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.frameCount = (this.frameCount || 0) + 1;
        this.fpsAccum = (this.fpsAccum || 0) + deltaTime;

        if (this.fpsAccum >= 1) {
            this.fps = Math.round(this.frameCount / this.fpsAccum);
            this.frameCount = 0;
            this.fpsAccum = 0;
        }

        this.OnTick(deltaTime);
    }

    /**
     * Updates the camera position based on the player's position.
     * Clamps the camera position to the world boundaries.
     */
    UpdateCamera() {
        let xTranslation = this.player.positionX - this.canvas.width / 2 + this.player.sizeX / 2;

        if (xTranslation < World.WORLD_BOUNDS.minX) xTranslation = World.WORLD_BOUNDS.minX;
        if (xTranslation > World.WORLD_BOUNDS.maxX - 720) xTranslation = World.WORLD_BOUNDS.maxX - 720;
        this.camera.x = xTranslation;
    }

    /**
     * Called every frame. Coordinates all world updates:
     * camera, rendering, GameObjects, UI, collisions, and game state.
     * @param {number} deltaTime - Time in seconds since the previous frame.
     */
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

        this.CheckGameState();
    }

    /**
     * Calls {@link GameObject#OnTick} for all GameObjects.
     * @param {number} deltaTime - Time in seconds since the previous frame.
     */
    UpdateGameObjects(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.OnTick(deltaTime);
        });
    }

    /**
     * Calls {@link PlayerHUD#OnTick} for all UI objects.
     * @param {number} deltaTime - Time in seconds since the previous frame.
     */
    UpdateUIObjects(deltaTime) {
        this.playerHUD.OnTick(deltaTime);
    }
    /**
     * Checks whether two GameObjects collide based on their bounding boxes and collision offsets.
     * @param {GameObject} a - First GameObject.
     * @param {GameObject} b - Second GameObject.
     * @returns {boolean} `true` if the two objects are colliding.
     */
    IsColliding(a, b) {
        return (
            a.positionX + a.collisionOffset.left <
            b.positionX + b.sizeX - b.collisionOffset.right &&

            a.positionX + a.sizeX - a.collisionOffset.right >
            b.positionX + b.collisionOffset.left &&

            a.positionY + a.collisionOffset.top <
            b.positionY + b.sizeY - b.collisionOffset.bottom &&

            a.positionY + a.sizeY - a.collisionOffset.bottom >
            b.positionY + b.collisionOffset.top
        );
    }

    /**
     * Collects all active collisions of the current frame
     * and passes them to {@link World#ResolveCollisions}.
     */
    CheckCollisions() {
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

        this.ResolveCollisions(activeCollisions);
    }

    /**
     * Registers a collision between two objects in the activeCollisions map.
     * @param {Map<GameObject, Set<GameObject>>} activeCollisions - The current collision map.
     * @param {GameObject} a - The colliding object.
     * @param {GameObject} b - The target object of the collision.
     */
    RegisterCollision(activeCollisions, a, b) {
        if (!activeCollisions.has(a)) activeCollisions.set(a, new Set());
        activeCollisions.get(a).add(b);
    }

    /**
     * Resolves collision events: OnCollision (Stay), OnCollisionEnter, and OnCollisionExit.
     * @param {Map<GameObject, Set<GameObject>>} activeCollisions - All active collisions of the current frame.
     */
    ResolveCollisions(activeCollisions) {
        this.gameObjects.forEach(obj => {
            if (obj.collidableLayers.length === 0) return;

            const currentHits = activeCollisions.get(obj) ?? new Set();

            currentHits.forEach(other => {
                obj.OnCollision(other);
            });

            currentHits.forEach(other => {
                if (!obj.currentCollisions.has(other)) {
                    obj.OnCollisionEnter(other);
                }
            });

            obj.currentCollisions.forEach(other => {
                if (!currentHits.has(other)) {
                    obj.OnCollisionExit(other);
                }
            });

            obj.currentCollisions = currentHits;
        });
    }

    /**
     * Initializes all GameObjects of the world in the correct rendering order.
     */
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

    /**
     * Creates background and middleground tiles for the entire world width.
     */
    CreateBackgrounds() {
        for (let index = 0; index < 4; index++) {
            this.gameObjects.push(new Background(this.context, 720 * index, 0, 721, 480, SpriteAssets.BACKGROUNDS.SUNNY_LAND_BASE));
        }
        for (let index = 0; index < 17; index++) {
            this.gameObjects.push(new Background(this.context, 176 * index, 250, 177, 368, SpriteAssets.MIDDLEGROUNDS.SUNNY_LAND_BASE));
        }
    }

    /**
     * Creates the main level ground.
     */
    CreateLevel() {
        this.gameObjects.push(this.level_1 = new Level(this.context, 0, 400, 2880, 80, SpriteAssets.LEVEL.LEVEL_1));
    }

    /**
     * Creates the grass layer above the main ground.
     */
    CreateGrass() {
        this.gameObjects.push(this.level_1_grass = new Level(this.context, 0, 386, 2880, 16, SpriteAssets.LEVEL.LEVEL_1_GRASS));
    }

    /**
  * Creates all decorative props (trees, rocks, mushrooms) with random positioning.
  */
    CreateProps() {
        this.CreateProp(SpriteAssets.PROPS.TREE, 15, 79, 100, 176, 200);
        this.CreateProp(SpriteAssets.PROPS.ROCK_2, 7, 66, 80, 55, 70);
        this.CreateProp(SpriteAssets.PROPS.ROCK, 12, 28, 40, 15, 30);
        this.CreateProp(SpriteAssets.PROPS.SHROOMS, 30, 16, 20, 15, 20);
    }

    /**
     * Creates a specific amount of props of a type with random size and position.
     * @param {string} sprite - The sprite key from {@link SpriteAssets}.
     * @param {number} amount - Number of props to create.
     * @param {number} minX - Minimum width of the prop in pixels.
     * @param {number} maxX - Maximum width of the prop in pixels.
     * @param {number} minY - Minimum height of the prop in pixels.
     * @param {number} maxY - Maximum height of the prop in pixels.
     */
    CreateProp(sprite, amount, minX, maxX, minY, maxY) {
        for (let index = 0; index < amount; index++) {
            let positionX = index * Util.GetRandomRange(200, 300) + Util.GetRandomRange(0, 500);
            let sizeX = Util.GetRandomRange(minX, maxX);
            let sizeY = Util.GetRandomRange(minY, maxY);
            let positionY = World.WORLD_BOUNDS.maxY - sizeY - this.level_1.sizeY;
            this.gameObjects.push(new Prop(this.context, positionX, positionY, sizeX, sizeY, sprite))
        }
    }

    /**
     * Creates the goal object (wooden house) at the end of the level.
     */
    CreateGoal() {
        this.gameObjects.push(this.woodenHouse = new Goal(this.context, 2760, 302, 112, 98, SpriteAssets.PROPS.WOODEN_HOUSE));
    }

    /**
     * Creates all collectible objects (cherries and gems) with random positioning.
     */
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

    /**
     * Creates all enemies: 5 minions with random positions and a boss at the end of the level.
     */
    CreateEnemies() {
        for (let index = 0; index < 5; index++) {
            let positionX = index * Util.GetRandomRange(200, 300) + Util.GetRandomRange(0, 500);
            let minion = new Minion(this.context, positionX, 336, 64, 64);
            this.gameObjects.push(minion);
        }

        this.gameObjects.push(this.boss = new Boss(this.context, 2560, 272, 128, 128));
    }

    /**
     * Creates a pool of 7 projectiles that are reused by the player.
     * Inactive projectiles are parked outside the visible area.
     */
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

    /**
     * Creates the player and provides the projectile pool.
     */
    CreatePlayer() {
        this.gameObjects.push(this.player = new Player(this.context, 0, 336, 64, 64, this.projectilePool));
    }

    /**
     * Creates the player's HUD (Heads-Up Display).
     */
    CreateUI() {
        this.playerHUD = new PlayerHUD(this.context, this.camera, this.player);
    }

    /**
     * Starts the boss fight when the player gets close enough to the boss.
     * Will not trigger again after the fight has started.
     */
    StartBossFight() {
        if (this.boss.fightStarted) return;
        if (this.player.positionX >= 2320) this.boss.BeginFight(this.player);
    }

    /**
     * Checks every frame whether the game has been won or lost
     * and triggers the corresponding UI function.
     */
    CheckGameState() {
        if (this.gameEnded) return;

        if (this.player.state === this.player.PlayerState.DEAD) {
            this.gameEnded = true;
            showGameOver();
        }
        if (this.player.state === this.player.PlayerState.VICTORY) {
            this.gameEnded = true;
            showVictory();
        }
    }

    /**
  * Stops the game loop and stops all audio playback.
  * Should be called when the World instance is no longer needed.
  */
    Destroy() {
        cancelAnimationFrame(this.rafId);
        AudioManager.StopAll();
    }
}
/**
 * @fileoverview Verwaltet die Spielwelt, alle GameObjects, die Kamera, Kollisionen und den Spielzustand.
 * @module World
 */

/**
 * Repräsentiert die gesamte Spielwelt.
 * Verantwortlich für den Game Loop, die Kamera, Kollisionserkennung und die Verwaltung aller GameObjects.
 */
class World {

    /**
     * Die Grenzen der Spielwelt in Pixeln.
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
     * Erstellt eine neue Instanz der Spielwelt.
     * @param {HTMLCanvasElement} canvas - Das Canvas-Element auf dem die Welt gerendert wird.
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
     * Der Haupt-Game-Loop. Wird einmal pro Frame vom Browser aufgerufen.
     * Berechnet deltaTime und delegiert an {@link World#OnTick}.
     * @param {DOMHighResTimeStamp} now - Zeitstempel des aktuellen Frames in Millisekunden.
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
     * Aktualisiert die Kameraposition anhand der Spielerposition.
     * Begrenzt die Kamera auf die Weltgrenzen.
     */
    UpdateCamera() {
        let xTranslation = this.player.positionX - this.canvas.width / 2 + this.player.sizeX / 2;

        if (xTranslation < World.WORLD_BOUNDS.minX) xTranslation = World.WORLD_BOUNDS.minX;
        if (xTranslation > World.WORLD_BOUNDS.maxX - 720) xTranslation = World.WORLD_BOUNDS.maxX - 720;
        this.camera.x = xTranslation;
    }

    /**
     * Wird jeden Frame aufgerufen. Koordiniert alle Welt-Updates:
     * Kamera, Rendering, GameObjects, UI, Kollisionen und Spielzustand.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
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
     * Ruft {@link GameObject#OnTick} für alle GameObjects auf.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    UpdateGameObjects(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.OnTick(deltaTime);
        });
    }

    /**
     * Ruft {@link PlayerHUD#OnTick} für alle UI-Objekte auf.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    UpdateUIObjects(deltaTime) {
        this.playerHUD.OnTick(deltaTime);
    }

    /**
     * Prüft ob zwei GameObjects anhand ihrer Bounding Boxes und CollisionOffsets kollidieren.
     * @param {GameObject} a - Erstes GameObject.
     * @param {GameObject} b - Zweites GameObject.
     * @returns {boolean} `true` wenn die beiden Objekte kollidieren.
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
     * Sammelt alle aktiven Kollisionen des aktuellen Frames
     * und übergibt sie an {@link World#ResolveCollisions}.
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
     * Registriert eine Kollision zwischen zwei Objekten in der activeCollisions Map.
     * @param {Map<GameObject, Set<GameObject>>} activeCollisions - Die aktuelle Kollisions-Map.
     * @param {GameObject} a - Das kolliderende Objekt.
     * @param {GameObject} b - Das Zielobjekt der Kollision.
     */
    RegisterCollision(activeCollisions, a, b) {
        if (!activeCollisions.has(a)) activeCollisions.set(a, new Set());
        activeCollisions.get(a).add(b);
    }

    /**
     * Löst Kollisionsereignisse auf: OnCollision (Stay), OnCollisionEnter und OnCollisionExit.
     * @param {Map<GameObject, Set<GameObject>>} activeCollisions - Alle aktiven Kollisionen des aktuellen Frames.
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
     * Initialisiert alle GameObjects der Welt in der korrekten Render-Reihenfolge.
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
     * Erstellt Hintergrund- und Mittelgrund-Kacheln für die gesamte Weltbreite.
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
     * Erstellt den Hauptboden des Levels.
     */
    CreateLevel() {
        this.gameObjects.push(this.level_1 = new Level(this.context, 0, 400, 2880, 80, SpriteAssets.LEVEL.LEVEL_1));
    }

    /**
     * Erstellt die Grasschicht über dem Hauptboden.
     */
    CreateGrass() {
        this.gameObjects.push(this.level_1_grass = new Level(this.context, 0, 386, 2880, 16, SpriteAssets.LEVEL.LEVEL_1_GRASS));
    }

    /**
     * Erstellt alle dekorativen Props (Bäume, Steine, Pilze) mit zufälliger Positionierung.
     */
    CreateProps() {
        this.CreateProp(SpriteAssets.PROPS.TREE, 15, 79, 100, 176, 200);
        this.CreateProp(SpriteAssets.PROPS.ROCK_2, 7, 66, 80, 55, 70);
        this.CreateProp(SpriteAssets.PROPS.ROCK, 12, 28, 40, 15, 30);
        this.CreateProp(SpriteAssets.PROPS.SHROOMS, 30, 16, 20, 15, 20);
    }

    /**
     * Erstellt eine bestimmte Anzahl an Props eines Typs mit zufälliger Größe und Position.
     * @param {string} sprite - Der Sprite-Key aus {@link SpriteAssets}.
     * @param {number} amount - Anzahl der zu erstellenden Props.
     * @param {number} minX - Minimale Breite des Props in Pixeln.
     * @param {number} maxX - Maximale Breite des Props in Pixeln.
     * @param {number} minY - Minimale Höhe des Props in Pixeln.
     * @param {number} maxY - Maximale Höhe des Props in Pixeln.
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
     * Erstellt das Zielobjekt (Holzhaus) am Ende des Levels.
     */
    CreateGoal() {
        this.gameObjects.push(this.woodenHouse = new Goal(this.context, 2760, 302, 112, 98, SpriteAssets.PROPS.WOODEN_HOUSE));
    }

    /**
     * Erstellt alle einsammelbaren Objekte (Kirschen und Edelsteine) mit zufälliger Positionierung.
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
     * Erstellt alle Gegner: 5 Minions mit zufälliger Position und einen Boss am Levelende.
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
     * Erstellt einen Pool aus 7 Projektilen die vom Spieler wiederverwendet werden.
     * Inaktive Projektile werden außerhalb des sichtbaren Bereichs geparkt.
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
     * Erstellt den Spieler und übergibt ihm den Projektil-Pool.
     */
    CreatePlayer() {
        this.gameObjects.push(this.player = new Player(this.context, 0, 336, 64, 64, this.projectilePool));
    }

    /**
     * Erstellt das HUD (Heads-Up-Display) für den Spieler.
     */
    CreateUI() {
        this.playerHUD = new PlayerHUD(this.context, this.camera, this.player);
    }

    /**
     * Startet den Bossfight sobald der Spieler nah genug am Boss ist.
     * Wird nach dem ersten Start nicht erneut ausgelöst.
     */
    StartBossFight() {
        if (this.boss.fightStarted) return;
        if (this.player.positionX >= 2420) this.boss.BeginFight();
    }

    /**
     * Prüft jeden Frame ob das Spiel gewonnen oder verloren wurde
     * und löst die entsprechende UI-Funktion aus.
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
     * Beendet den Game Loop und stoppt alle Audiowiedergaben.
     * Sollte aufgerufen werden wenn die World-Instanz nicht mehr benötigt wird.
     */
    Destroy() {
        cancelAnimationFrame(this.rafId);
        AudioManager.StopAll();
    }
}
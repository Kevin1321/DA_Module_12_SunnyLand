/**
 * @fileoverview Implementiert den Vulture-Boss als fliegenden Endgegner.
 * @module Boss
 */

/**
 * Der Endgegner des Spiels — ein fliegender Vulture der sich zufällig durch die Welt bewegt.
 * Erweitert {@link Enemy} um Flugbewegung in X- und Y-Richtung sowie einen verzögerten Kampfstart.
 * Verursacht 1 Schaden beim Kontakt mit dem Spieler und hat 5 Lebenspunkte.
 * @extends Enemy
 */
class Boss extends Enemy {

    /**
     * Erstellt einen neuen Boss.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Startposition in Pixeln.
     * @param {number} positionY - Y-Startposition in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();
        this.state = this.EnemyState.IDLE;
        this.health = 5;
        this.speed = 50;

        /**
         * Aktuelle Bewegungsrichtung auf der X-Achse (-1, 0 oder 1).
         * @type {number}
         */
        this.xDirection = -1;

        /**
         * Aktuelle Bewegungsrichtung auf der Y-Achse (-1, 0 oder 1).
         * @type {number}
         */
        this.yDirection = -1;

        /**
         * Intervall in Millisekunden zwischen Richtungswechseln.
         * @type {number}
         */
        this.timeOut = 2000;

        this.collisionOffset = {
            top: 30,
            bottom: 30,
            left: 20,
            right: 40
        }

        /**
         * Gibt an ob der Kampf bereits gestartet wurde.
         * Verhindert einen erneuten Start durch {@link World#StartBossFight}.
         * @type {boolean}
         */
        this.fightStarted = false;
    }

    /**
     * Wird jeden Frame aufgerufen.
     * Prüft ob der Boss gestorben ist, bewegt ihn und rendert ihn.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        if (this.isDead && this.state != this.EnemyState.DEAD) this.EnemyDead();
        if (this.state == this.EnemyState.MOVE) this.Move(deltaTime);
        this.Animate(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    /**
     * Bewegt den Boss in die aktuelle X- und Y-Richtung.
     * Begrenzt die Position auf die Weltgrenzen via {@link Util.Clamp}.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Move(deltaTime) {
        this.positionX += this.speed * this.xDirection * deltaTime;
        this.positionX = Util.Clamp(this.positionX, World.WORLD_BOUNDS.minX, World.WORLD_BOUNDS.maxX - this.sizeX);
        this.positionY += this.speed * this.yDirection * deltaTime;
        this.positionY = Util.Clamp(this.positionY, World.WORLD_BOUNDS.minY, World.WORLD_BOUNDS.maxY);
    }

    /**
     * Setzt den passenden Animations-Frame basierend auf dem aktuellen Zustand.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Animate(deltaTime) {
        super.Animate(deltaTime);
        if (this.state == this.EnemyState.IDLE) this.SetAnimationFrame(this.idle.nextFrame(deltaTime));
        if (this.state == this.EnemyState.MOVE) this.SetAnimationFrame(this.flying.nextFrame(deltaTime));
        if (this.state == this.EnemyState.DEAD) this.SetAnimationFrame(this.death.nextFrame(deltaTime));
    }

    /**
     * Startet den Bossfight — wird von {@link World#StartBossFight} aufgerufen
     * sobald der Spieler nah genug ist.
     * Setzt den Zustand auf MOVE und beginnt mit dem periodischen Richtungswechsel.
     */
    BeginFight() {
        this.fightStarted = true;
        this.state = this.EnemyState.MOVE;
        this.SwitchDirection();
    }

    /**
     * Wählt eine neue zufällige Bewegungsrichtung für X und Y
     * und startet einen Timeout für den nächsten Richtungswechsel.
     */
    SwitchDirection() {
        this.xDirection = Util.GetRandomNormalized();
        this.yDirection = Util.GetRandomNormalized();
        this.timeoutId = setTimeout(() => this.SwitchDirection(), this.timeOut);
    }

    /**
     * Wird aufgerufen wenn der Boss stirbt.
     * Bricht den laufenden Richtungs-Timeout ab, setzt den Zustand auf DEAD
     * und spielt den Todeseffekt ab.
     */
    EnemyDead() {
        clearTimeout(this.timeoutId);
        this.state = this.EnemyState.DEAD;
        AudioManager.Play(AudioAssets.ENEMY_DEATH);
    }

    /**
     * Callback der am Ende der Todesanimation ausgelöst wird.
     * Deaktiviert den Boss und verschiebt ihn aus dem sichtbaren Bereich.
     * @type {Function}
     */
    OnEndOfAnimation = () => {
        this.isActive = false;
        this.positionX = -1500;
        this.positionY = -1500;
    }

    /**
     * Initialisiert alle {@link Animation} Instanzen für Idle, Flug und Tod.
     * Registriert den {@link Boss#OnEndOfAnimation} Callback auf der Todesanimation.
     */
    CreateAnimations() {
        this.idle = new Animation([
            SpriteAssets.VULTURE.IDLE_1,
            SpriteAssets.VULTURE.IDLE_2,
            SpriteAssets.VULTURE.IDLE_3,
            SpriteAssets.VULTURE.IDLE_4
        ]);

        this.flying = new Animation([
            SpriteAssets.VULTURE.FLYING_1,
            SpriteAssets.VULTURE.FLYING_2,
            SpriteAssets.VULTURE.FLYING_3,
            SpriteAssets.VULTURE.FLYING_4
        ]);

        this.death = new Animation([
            SpriteAssets.VFX.ENEMY_DEATH_1,
            SpriteAssets.VFX.ENEMY_DEATH_2,
            SpriteAssets.VFX.ENEMY_DEATH_3,
            SpriteAssets.VFX.ENEMY_DEATH_4,
            SpriteAssets.VFX.ENEMY_DEATH_5,
            SpriteAssets.VFX.ENEMY_DEATH_6
        ]);

        this.death.addEventListener("EndOfAnimation", this.OnEndOfAnimation);
    }
}
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
     * Bewegt den Boss auf den Spieler zu, mit einer Sinuskurve in Y-Richtung.
     * Begrenzt die Position auf die Weltgrenzen.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Move(deltaTime) {
        // X: auf den Spieler zu (Mitte Boss → Mitte Spieler)
        const targetX = this.player.positionX + this.player.sizeX / 2 - this.sizeX / 2;
        const dx = targetX - this.positionX;
        const distX = Math.abs(dx);

        if (distX > 2) {
            this.positionX += Math.sign(dx) * Math.min(this.speed * deltaTime, distX);
        }
        this.positionX = Util.Clamp(this.positionX, World.WORLD_BOUNDS.minX, World.WORLD_BOUNDS.maxX - this.sizeX);

        // Y: Sinuskurve — schwingt auf und ab während er sich annähert
        this.sineTime += deltaTime;
        const AMPLITUDE = 40;  // Höhe der Auf-/Abbewegung in Pixeln
        const FREQUENCY = 1.2; // Schwingungen pro Sekunde
        const baseY =  Level.GROUND - this.sizeY * 0.5; // etwas oberhalb des Spielers
        this.positionY = baseY + Math.sin(this.sineTime * FREQUENCY * Math.PI * 2) * AMPLITUDE;
        this.positionY = Util.Clamp(
            this.positionY,
            World.WORLD_BOUNDS.minY,
            Level.GROUND - this.sizeY + 50
        );
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
     * Startet den Bossfight.
     * @param {Player} player - Referenz auf den Spieler für die Verfolgungslogik.
     */
    BeginFight(player) {
        this.fightStarted = true;
        this.player = player;
        this.state = this.EnemyState.MOVE;
        this.sineTime = 0;
    }

    /**
     * Wird aufgerufen wenn der Boss stirbt.
     * Bricht den laufenden Richtungs-Timeout ab, setzt den Zustand auf DEAD
     * und spielt den Todeseffekt ab.
     */
    EnemyDead() {
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
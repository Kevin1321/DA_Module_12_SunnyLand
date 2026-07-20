/**
 * @fileoverview Implementiert den Slimer-Minion als einfachen patrouillierenden Gegner.
 * @module Minion
 */

/**
 * Einfacher Gegner der periodisch zwischen links und rechts patrouilliert.
 * Erweitert {@link Enemy} um Bewegungs- und Animationslogik.
 * Verursacht 0.5 Schaden beim Kontakt mit dem Spieler.
 * @extends Enemy
 */
class Minion extends Enemy {

    /**
     * Erstellt einen neuen Minion.
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
        this.health = 1;
        this.speed = 30;
        this.isMovingRight = false;
        this.direction = -1;

        /**
         * Zufälliges Intervall in Millisekunden zwischen Richtungswechsel und Idle-Pausen.
         * @type {number}
         */
        this.timeOut = Util.GetRandomRange(3000, 6000);

        this.collisionOffset = {
            top: 20,
            bottom: 20,
            left: 15,
            right: 15
        }

        /**
         * ID des aktuell laufenden Timeouts — wird für {@link Minion#EnemyDead} benötigt.
         * @type {number}
         */
        this.timeoutId = setTimeout(() => this.SwitchDirection(), this.timeOut);
    }

    /**
     * Wird jeden Frame aufgerufen.
     * Prüft ob der Minion gestorben ist, bewegt ihn und rendert ihn.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        if (this.isDead && this.state != this.EnemyState.DEAD) this.EnemyDead();
        if (this.state == this.EnemyState.MOVE) this.Move(deltaTime);
        this.Animate(deltaTime);
        this.DrawImage();
    }

    /**
     * Bewegt den Minion in die aktuelle Richtung.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Move(deltaTime) {
        this.positionX += this.speed * this.direction * deltaTime;
    }

    /**
     * Setzt den passenden Animations-Frame basierend auf dem aktuellen Zustand.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Animate(deltaTime) {
        super.Animate(deltaTime);
        if (this.state == this.EnemyState.IDLE) this.SetAnimationFrame(this.idle.nextFrame(deltaTime));
        if (this.state == this.EnemyState.MOVE) this.SetAnimationFrame(this.move.nextFrame(deltaTime));
        if (this.state == this.EnemyState.DEAD) this.SetAnimationFrame(this.death.nextFrame(deltaTime));
    }

    /**
     * Zeichnet den Minion auf den Canvas.
     * Spiegelt das Sprite horizontal wenn der Minion sich nach rechts bewegt.
     */
    DrawImage() {
        if (this.isMovingRight) {
            this.context.save();
            this.context.translate(this.sizeX, 0);
            this.context.scale(-1, 1);
            this.positionX *= -1;
        }

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);

        if (this.isMovingRight) {
            this.positionX *= -1;
            this.context.restore();
        }
    }

    /**
     * Wechselt die Bewegungsrichtung des Minions und startet einen neuen Timeout für {@link Minion#Idle}.
     */
    SwitchDirection() {
        this.state = this.EnemyState.MOVE;

        if (this.isMovingRight) {
            this.isMovingRight = false;
            this.direction = -1;
        } else {
            this.isMovingRight = true;
            this.direction = 1;
        }

        this.timeoutId = setTimeout(() => this.Idle(), this.timeOut);
    }

    /**
     * Versetzt den Minion in den Idle-Zustand und startet einen Timeout für {@link Minion#SwitchDirection}.
     */
    Idle() {
        this.state = this.EnemyState.IDLE;
        this.timeoutId = setTimeout(() => this.SwitchDirection(), this.timeOut);
    }

    /**
     * Wird aufgerufen wenn der Minion stirbt.
     * Bricht den laufenden Timeout ab, setzt den Zustand auf DEAD und spielt den Todeseffekt ab.
     */
    EnemyDead() {
        clearTimeout(this.timeoutId);
        this.state = this.EnemyState.DEAD;
        AudioManager.Play(AudioAssets.ENEMY_DEATH);
    }

    /**
     * Callback der am Ende der Todesanimation ausgelöst wird.
     * Deaktiviert den Minion und verschiebt ihn aus dem sichtbaren Bereich.
     * @type {Function}
     */
    OnEndOfAnimation = () => {
        this.isActive = false;
        this.positionX = -1500;
        this.positionY = -1500;
    }

    /**
     * Initialisiert alle {@link Animation} Instanzen für Idle, Bewegung und Tod.
     * Registriert den {@link Minion#OnEndOfAnimation} Callback auf der Todesanimation.
     */
    CreateAnimations() {
        this.idle = new Animation([
            SpriteAssets.SLIMER.IDLE_1,
            SpriteAssets.SLIMER.IDLE_2,
            SpriteAssets.SLIMER.IDLE_3,
            SpriteAssets.SLIMER.IDLE_4,
            SpriteAssets.SLIMER.IDLE_5,
            SpriteAssets.SLIMER.IDLE_6,
            SpriteAssets.SLIMER.IDLE_7,
            SpriteAssets.SLIMER.IDLE_8
        ]);

        this.move = new Animation([
            SpriteAssets.SLIMER.MOVE_1,
            SpriteAssets.SLIMER.MOVE_2,
            SpriteAssets.SLIMER.MOVE_3,
            SpriteAssets.SLIMER.MOVE_4,
            SpriteAssets.SLIMER.MOVE_5,
            SpriteAssets.SLIMER.MOVE_6,
            SpriteAssets.SLIMER.MOVE_7
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
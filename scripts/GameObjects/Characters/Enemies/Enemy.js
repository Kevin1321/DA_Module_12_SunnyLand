/**
 * @fileoverview Basisklasse für alle Gegner im Spiel.
 * @module Enemy
 */

/**
 * Basisklasse für alle Gegner.
 * Erweitert {@link Character} um gegner-spezifische Zustände und Kollisions-Layer.
 * Wird von {@link Minion} und {@link Boss} weiter spezialisiert.
 * @extends Character
 */
class Enemy extends Character {

    /**
     * Enum der möglichen Zustände eines Gegners.
     * @readonly
     * @enum {string}
     */
    EnemyState = Object.freeze({
        /** Gegner steht still. */
        IDLE: "idle",
        /** Gegner bewegt sich. */
        MOVE: "move",
        /** Gegner greift an. */
        ATTACK: "attack",
        /** Gegner ist tot. */
        DEAD: "dead"
    });

    /**
     * Erstellt einen neuen Gegner.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.health = 1;
        this.layer = CollisionLayers.ENEMY;
        this.collidableLayers = [CollisionLayers.PLAYER, CollisionLayers.PROJECTILE];
    }

    /**
     * Wird jeden Frame aufgerufen. Delegiert an {@link Character#OnTick}.
     * Kann in Unterklassen überschrieben werden.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
    }

    /**
     * Steuert die Animationslogik des Gegners. Delegiert an {@link Character#Animate}.
     * Muss in Unterklassen implementiert werden.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Animate(deltaTime) {
        super.Animate(deltaTime);
    }

    /**
     * Wird aufgerufen wenn der Gegner stirbt.
     * Spielt den Todeseffekt ab sofern der Gegner noch aktiv ist.
     * Kann in Unterklassen überschrieben werden um weitere Logik hinzuzufügen.
     */
    EnemyDead() {
        if (this.isActive) AudioManager.Play(AudioAssets.ENEMY_DEATH, false);
    }
}
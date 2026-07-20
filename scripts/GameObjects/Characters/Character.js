/**
 * @fileoverview Basisklasse für alle spielbaren und nicht-spielbaren Charaktere.
 * @module Character
 */

/**
 * Basisklasse für alle Charaktere im Spiel.
 * Erweitert {@link GameObject} um Gesundheit, Tod und Schadensmechaniken.
 * Wird von {@link Player} und {@link Enemy} weiter spezialisiert.
 * @extends GameObject
 */
class Character extends GameObject {

    /**
     * Erstellt einen neuen Charakter.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        /**
         * Maximale Gesundheit des Charakters.
         * @type {number}
         */
        this.maxHealth = 0;

        /**
         * Aktuelle Gesundheit des Charakters.
         * @type {number}
         */
        this.health = 0;

        /**
         * Gibt an ob der Charakter tot ist.
         * Wird automatisch von {@link Character#TakeDamage} gesetzt.
         * @type {boolean}
         */
        this.isDead = false;
    }

    /**
     * Wird jeden Frame aufgerufen. Delegiert an {@link GameObject#OnTick}.
     * Kann in Unterklassen überschrieben werden.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
    }

    /**
     * Steuert die Animationslogik des Charakters.
     * Muss in Unterklassen implementiert werden.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Animate(deltaTime) {
    }

    /**
     * Wird einmalig aufgerufen wenn eine neue Kollision beginnt.
     * @param {GameObject} collider - Das Objekt mit dem die Kollision begonnen hat.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
    }

    /**
     * Wird jeden Frame aufgerufen solange eine Kollision besteht.
     * @param {GameObject} collider - Das Objekt mit dem kollodiert wird.
     */
    OnCollision(collider) {
        super.OnCollision(collider);
    }

    /**
     * Wird einmalig aufgerufen wenn eine Kollision endet.
     * @param {GameObject} collider - Das Objekt mit dem die Kollision geendet hat.
     */
    OnCollisionExit(collider) {
        super.OnCollisionExit(collider);
    }

    /**
     * Reduziert die Gesundheit des Charakters um den angegebenen Betrag.
     * Gesundheit wird auf mindestens 0 begrenzt.
     * Setzt {@link Character#isDead} auf `true` wenn die Gesundheit 0 erreicht.
     * @param {number} amount - Der zu abziehende Schadensbetrag.
     */
    TakeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.isDead = this.health == 0;
    }
}
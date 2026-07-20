/**
 * @fileoverview Implementiert den Levelboden als statisches GameObject.
 * @module Level
 */

/**
 * Der Levelboden — eine statische Kachel die als Grundlage der Spielwelt dient.
 * Erweitert {@link GameObject} um einfaches Rendering ohne Kollisionslogik.
 * Stellt die statische {@link Level.GROUND} Konstante bereit die von
 * {@link Player} und {@link World} als Referenz für die Bodenposition verwendet wird.
 * @extends GameObject
 */
class Level extends GameObject {

    /**
     * Y-Position des Bodens in Pixeln.
     * Wird von {@link Player#OnTick} und {@link Player#ApplyGravity} verwendet
     * um den Spieler auf dem Boden zu halten.
     * @static
     * @type {number}
     */
    static GROUND = 336;

    /**
     * Erstellt einen neuen Levelboden.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     * @param {string} imgSrc - Pfad zum Level-Sprite aus {@link SpriteAssets.LEVEL}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Wird jeden Frame aufgerufen und rendert den Levelboden auf den Canvas.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
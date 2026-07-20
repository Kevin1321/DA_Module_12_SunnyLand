/**
 * @fileoverview Implementiert dekorative Props in der Spielwelt.
 * @module Prop
 */

/**
 * Ein dekoratives Prop ohne Kollisionslogik.
 * Erweitert {@link GameObject} um einfaches Rendering von Umgebungsobjekten
 * wie Bäumen, Steinen und Pilzen.
 * Wird von {@link World#CreateProp} mit zufälliger Position und Größe erstellt.
 * @extends GameObject
 */
class Prop extends GameObject {

    /**
     * Erstellt ein neues Prop.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     * @param {string} imgSrc - Pfad zum Prop-Sprite aus {@link SpriteAssets.PROPS}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Wird jeden Frame aufgerufen und rendert das Prop auf den Canvas.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
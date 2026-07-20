/**
 * @fileoverview Implementiert die dekorative Grasschicht über dem Levelboden.
 * @module Grass
 */

/**
 * Eine statische Grasschicht die dekorativ über dem Hauptboden gerendert wird.
 * Erweitert {@link GameObject} um einfaches Rendering ohne Kollisionslogik.
 * Wird von {@link World#CreateGrass} als durchgehende Kachel über die gesamte Weltbreite erstellt.
 * @extends GameObject
 */
class Grass extends GameObject {

    /**
     * Erstellt eine neue Grass-Kachel.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     * @param {string} imgSrc - Pfad zum Gras-Sprite aus {@link SpriteAssets.LEVEL}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Wird jeden Frame aufgerufen und rendert die Grass-Kachel auf den Canvas.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
/**
 * @fileoverview Implementiert statische Hintergrund- und Mittelgrund-Kacheln.
 * @module Background
 */

/**
 * Eine statische Hintergrund- oder Mittelgrund-Kachel.
 * Erweitert {@link GameObject} um einfaches Rendering eines Sprites ohne Kollisionslogik.
 * Wird von {@link World#CreateBackgrounds} in Kacheln über die gesamte Weltbreite verteilt.
 * @extends GameObject
 */
class Background extends GameObject {

    /**
     * Erstellt eine neue Hintergrund-Kachel.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     * @param {string} imgSrc - Pfad zum Hintergrund-Sprite aus {@link SpriteAssets}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.img.src = imgSrc;
    }

    /**
     * Wird jeden Frame aufgerufen und rendert die Hintergrund-Kachel auf den Canvas.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }
}
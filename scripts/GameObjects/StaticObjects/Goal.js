/**
 * @fileoverview Implementiert das Zielobjekt am Ende des Levels.
 * @module Goal
 */

/**
 * Das Zielobjekt (Holzhaus) am Ende des Levels.
 * Erweitert {@link GameObject} um Kollisionslogik die den Sieg des Spielers auslöst.
 * Wird von {@link World#CreateGoal} erstellt und von {@link World#StartBossFight} indirekt koordiniert.
 * @extends GameObject
 */
class Goal extends GameObject {

    /**
     * Erstellt ein neues Zielobjekt.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     * @param {string} imgSrc - Pfad zum Sprite aus {@link SpriteAssets}.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, imgSrc) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.GOAL;
        this.collidableLayers = [CollisionLayers.PLAYER];

        this.img.src = imgSrc;
    }

    /**
     * Wird jeden Frame aufgerufen und rendert das Zielobjekt auf den Canvas.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    /**
     * Wird aufgerufen wenn der Spieler das Zielobjekt berührt.
     * Versetzt den Spieler in den Victory-Zustand via {@link Player#Victory}.
     * @param {GameObject} collider - Das Objekt das das Ziel berührt hat.
     */
    OnCollisionEnter(collider) {
        super.OnCollision(collider);

        if (collider instanceof Player) {
            collider.Victory();
        }
    }
}
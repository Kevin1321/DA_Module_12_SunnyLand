/**
 * @fileoverview Implementiert den Edelstein als einsammelbares Objekt.
 * @module Gem
 */

/**
 * Ein einsammelbarer Edelstein.
 * Erweitert {@link PickUp} um eine Idle-Animation und Einsammel-Logik.
 * Beim Einsammeln wird der {@link Player#gemsCollected} Zähler erhöht.
 * @extends PickUp
 */
class Gem extends PickUp {

    /**
     * Erstellt einen neuen Edelstein.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        /**
         * Idle-Animation des Edelsteins.
         * @type {Animation}
         */
        this.idle = new Animation([
            SpriteAssets.PICK_UPS.GEM_1,
            SpriteAssets.PICK_UPS.GEM_2,
            SpriteAssets.PICK_UPS.GEM_3,
            SpriteAssets.PICK_UPS.GEM_4,
            SpriteAssets.PICK_UPS.GEM_5
        ]);
    }

    /**
     * Wird jeden Frame aufgerufen.
     * Spielt die Idle- oder Pickup-Feedback-Animation ab und rendert den Edelstein.
     * Tut nichts wenn der Edelstein nicht mehr aktiv ist.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);

        if (!this.isActive) return;

        if (this.hasBeenPickedUp) {
            this.SetAnimationFrame(this.pickedUp.nextFrame(deltaTime));
        } else {
            this.SetAnimationFrame(this.idle.nextFrame(deltaTime));
        }

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
    }

    /**
     * Wird aufgerufen wenn der Spieler den Edelstein berührt.
     * Markiert den Edelstein als eingesammelt und spielt den Item-Sound ab.
     * Der {@link Player#gemsCollected} Zähler wird in {@link Player#OnCollisionEnter} erhöht.
     * @param {GameObject} collider - Das Objekt das den Edelstein berührt hat.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        this.hasBeenPickedUp = true;
        AudioManager.Play(AudioAssets.ITEM, false);
    }
}
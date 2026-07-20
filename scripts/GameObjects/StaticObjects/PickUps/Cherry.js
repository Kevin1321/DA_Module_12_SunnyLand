/**
 * @fileoverview Implementiert die Kirsche als einsammelbares Objekt.
 * @module Cherry
 */

/**
 * Eine einsammelbare Kirsche.
 * Erweitert {@link PickUp} um eine Idle-Animation und Einsammel-Logik.
 * Beim Einsammeln wird der {@link Player#cherriesCollected} Zähler erhöht.
 * @extends PickUp
 */
class Cherry extends PickUp {

    /**
     * Erstellt eine neue Kirsche.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        /**
         * Idle-Animation der Kirsche.
         * @type {Animation}
         */
        this.idle = new Animation([
            SpriteAssets.PICK_UPS.CHERRY_1,
            SpriteAssets.PICK_UPS.CHERRY_2,
            SpriteAssets.PICK_UPS.CHERRY_3,
            SpriteAssets.PICK_UPS.CHERRY_4,
            SpriteAssets.PICK_UPS.CHERRY_5,
            SpriteAssets.PICK_UPS.CHERRY_6,
            SpriteAssets.PICK_UPS.CHERRY_7
        ]);
    }

    /**
     * Wird jeden Frame aufgerufen.
     * Spielt die Idle- oder Pickup-Feedback-Animation ab und rendert die Kirsche.
     * Tut nichts wenn die Kirsche nicht mehr aktiv ist.
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
     * Wird aufgerufen wenn der Spieler die Kirsche berührt.
     * Markiert die Kirsche als eingesammelt und spielt den Item-Sound ab.
     * Der {@link Player#cherriesCollected} Zähler wird in {@link Player#OnCollisionEnter} erhöht.
     * @param {GameObject} collider - Das Objekt das die Kirsche berührt hat.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        this.hasBeenPickedUp = true;
        AudioManager.Play(AudioAssets.ITEM, false);
    }
}
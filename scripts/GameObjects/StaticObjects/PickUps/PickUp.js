/**
 * @fileoverview Basisklasse für alle einsammelbaren Objekte im Spiel.
 * @module PickUp
 */

/**
 * Basisklasse für alle einsammelbaren Objekte.
 * Erweitert {@link GameObject} um Pickup-Logik und eine Feedback-Animation beim Einsammeln.
 * Wird von {@link Cherry} und {@link Gem} weiter spezialisiert.
 * @extends GameObject
 */
class PickUp extends GameObject {

    /**
     * Erstellt ein neues PickUp.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.PICKUP;
        this.collidableLayers = [CollisionLayers.PLAYER];

        /** @type {boolean} Gibt an ob das PickUp noch aktiv und einsammelbar ist. */
        this.isActive = true;

        /** @type {boolean} Gibt an ob das PickUp bereits eingesammelt wurde. */
        this.hasBeenPickedUp = false;

        /**
         * Feedback-Animation die beim Einsammeln abgespielt wird.
         * Löst {@link PickUp#OnEndOfAnimation} am Ende aus.
         * @type {Animation}
         */
        this.pickedUp = new Animation([
            SpriteAssets.VFX.ITEM_FEEDBACK_1,
            SpriteAssets.VFX.ITEM_FEEDBACK_2,
            SpriteAssets.VFX.ITEM_FEEDBACK_3,
            SpriteAssets.VFX.ITEM_FEEDBACK_4
        ]);

        this.pickedUp.addEventListener("EndOfAnimation", this.OnEndOfAnimation);
    }

    /**
     * Wird jeden Frame aufgerufen. Delegiert an {@link GameObject#OnTick}.
     * Muss in Unterklassen überschrieben werden um Animationen und Rendering zu implementieren.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
    }

    /**
     * Wird einmalig aufgerufen wenn der Spieler das PickUp berührt.
     * Muss in Unterklassen überschrieben werden um die Einsammel-Logik zu implementieren.
     * @param {GameObject} collider - Das Objekt das das PickUp berührt hat.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
    }

    /**
     * Callback der am Ende der Feedback-Animation ausgelöst wird.
     * Deaktiviert das PickUp und verschiebt es aus dem sichtbaren Bereich.
     * @type {Function}
     */
    OnEndOfAnimation = () => {
        this.isActive = false;
        this.positionX = -500;
        this.positionY = -500;
    }
}
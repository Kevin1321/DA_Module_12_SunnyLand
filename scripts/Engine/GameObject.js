/**
 * @fileoverview Basisklasse für alle Objekte in der Spielwelt.
 * @module GameObject
 */

/**
 * Basisklasse für alle GameObjects in der Spielwelt.
 * Stellt Position, Größe, Kollisionserkennung und grundlegende
 * Rendering-Funktionalität bereit.
 * Alle spielrelevanten Objekte erben von dieser Klasse.
 */
class GameObject {

    /**
     * Erstellt ein neues GameObject.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Position in Pixeln.
     * @param {number} positionY - Y-Position in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.img = new Image(this.sizeY, this.sizeX);

        /**
         * Abstände der Kollisionsbox vom Sprite-Rand in Pixeln.
         * @type {{ top: number, bottom: number, left: number, right: number }}
         */
        this.collisionOffset = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }

        /**
         * Der Kollisions-Layer dieses Objekts.
         * @type {string}
         * @see CollisionLayers
         */
        this.layer = CollisionLayers.DEFAULT;

        /**
         * Liste der Layer mit denen dieses Objekt kollidieren kann.
         * @type {string[]}
         * @see CollisionLayers
         */
        this.collidableLayers = [];

        /**
         * Set der GameObjects mit denen dieses Objekt aktuell kollidiert.
         * Wird jeden Frame von {@link World#ResolveCollisions} aktualisiert.
         * @type {Set<GameObject>}
         */
        this.currentCollisions = new Set();
    }

    /**
     * Setzt den aktuellen Animations-Frame als darzustellendes Bild.
     * @param {HTMLImageElement} img - Das neue Frame-Bild aus einer {@link Animation}.
     */
    SetAnimationFrame(img) {
        this.img = img;
    }

    /**
     * Wird jeden Frame von {@link World#UpdateGameObjects} aufgerufen.
     * Kann in Unterklassen überschrieben werden um Spiellogik zu implementieren.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
    }

    /**
     * Wird einmalig aufgerufen wenn eine neue Kollision mit einem anderen Objekt beginnt.
     * Kann in Unterklassen überschrieben werden.
     * @param {GameObject} collider - Das Objekt mit dem die Kollision begonnen hat.
     */
    OnCollisionEnter(collider) {
    }

    /**
     * Wird jeden Frame aufgerufen solange eine Kollision mit einem anderen Objekt besteht.
     * Kann in Unterklassen überschrieben werden.
     * @param {GameObject} collider - Das Objekt mit dem kollodiert wird.
     */
    OnCollision(collider) {
    }

    /**
     * Wird einmalig aufgerufen wenn eine Kollision mit einem anderen Objekt endet.
     * Kann in Unterklassen überschrieben werden.
     * @param {GameObject} collider - Das Objekt mit dem die Kollision geendet hat.
     */
    OnCollisionExit(collider) {
    }

    /**
     * Zeichnet die Kollisionsbox des Objekts als grünes Rechteck auf den Canvas.
     * Nützlich zum Debuggen von Kollisionsproblemen.
     */
    DrawCollisionRect() {
        this.context.beginPath();
        this.context.lineWidth = "2";
        this.context.strokeStyle = "green";
        this.context.rect(
            this.positionX + this.collisionOffset.left,
            this.positionY + this.collisionOffset.top,
            this.sizeX - this.collisionOffset.right,
            this.sizeY - this.collisionOffset.bottom);
        this.context.stroke();
    }
}
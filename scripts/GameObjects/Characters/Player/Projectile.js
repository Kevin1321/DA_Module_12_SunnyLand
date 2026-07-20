/**
 * @fileoverview Implementiert Projektile die der Spieler abfeuern kann.
 * @module Projectile
 */

/**
 * Ein Projektil das vom Spieler abgefeuert wird und Gegnern Schaden zufügt.
 * Wird als Pool in {@link World} verwaltet und per {@link Projectile#Shoot} aktiviert.
 * Inaktive Projektile werden außerhalb des sichtbaren Bereichs geparkt.
 * @extends GameObject
 */
class Projectile extends GameObject {

    /**
     * Erstellt ein neues Projektil.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Startposition in Pixeln.
     * @param {number} positionY - Y-Startposition in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     */
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.PROJECTILE;
        this.collidableLayers = [CollisionLayers.ENEMY];

        this.img.src = SpriteAssets.PROJECTILS.STAR;

        /** @type {number} Maximale Lebensdauer des Projektils in Sekunden. */
        this.lifetime = 3;

        /** @type {number} Bewegungsgeschwindigkeit in Pixeln pro Sekunde. */
        this.projectileSpeed = 200;

        /** @type {number} Akkumulierte Zeit seit dem Abfeuern in Sekunden. */
        this.currentTimeAlife = 0;

        /** @type {boolean} Gibt an ob das Projektil gerade aktiv fliegt. */
        this.isBeingShot = false;

        /** @type {number} Bewegungsrichtung: 1 = rechts, -1 = links. */
        this.direction = 1;
    }

    /**
     * Wird jeden Frame aufgerufen.
     * Bewegt das Projektil und prüft ob die Lebensdauer abgelaufen ist.
     * Rendert das Projektil nur wenn es aktiv ist.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        if (this.isBeingShot) {
            this.positionX += this.projectileSpeed * this.direction * deltaTime;
            this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
            this.currentTimeAlife += deltaTime;

            if (this.currentTimeAlife >= this.lifetime) {
                this.ResetProjectile();
            }
        }
    }

    /**
     * Wird aufgerufen wenn das Projektil einen Gegner trifft.
     * Fügt dem Gegner 1 Schadenspunkt zu und setzt das Projektil zurück.
     * @param {GameObject} collider - Das getroffene Objekt.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        if (collider instanceof Enemy) {
            collider.TakeDamage(1);
            this.ResetProjectile();
        }
    }

    /**
     * Aktiviert das Projektil und setzt seine Startposition und Richtung.
     * Wird vom {@link Player} aufgerufen.
     * @param {number} startPositionX - X-Startposition in Pixeln.
     * @param {number} startPositionY - Y-Startposition in Pixeln.
     * @param {number} direction - Flugrichtung: 1 = rechts, -1 = links.
     */
    Shoot(startPositionX, startPositionY, direction) {
        this.isBeingShot = true;
        this.positionX = startPositionX;
        this.positionY = startPositionY;
        this.direction = direction;
    }

    /**
     * Setzt das Projektil zurück und parkt es außerhalb des sichtbaren Bereichs.
     * Wird aufgerufen wenn die Lebensdauer abläuft oder ein Gegner getroffen wird.
     */
    ResetProjectile() {
        this.currentTimeAlife = 0;
        this.isBeingShot = false;
        this.positionX = -500;
        this.positionY = -500;
    }
}
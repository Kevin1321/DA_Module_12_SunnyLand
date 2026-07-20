/**
 * @fileoverview Basisklasse für alle UI-Objekte die auf dem Canvas gerendert werden.
 * @module UIObject
 */

/**
 * Basisklasse für alle UI-Objekte.
 * Im Gegensatz zu {@link GameObject} sind UIObjects kameragebunden —
 * sie werden immer relativ zur aktuellen Kameraposition gerendert
 * und bleiben damit fest auf dem Bildschirm sichtbar.
 */
class UIObject {

    /**
     * Erstellt ein neues UIObject.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {{ x: number, y: number }} camera - Die aktuelle Kameraposition der Welt.
     */
    constructor(context, camera) {
        this.context = context;
        this.camera = camera;
    }

    /**
     * Wird jeden Frame von {@link World#UpdateUIObjects} aufgerufen.
     * Kann in Unterklassen überschrieben werden um UI-Logik und Rendering zu implementieren.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
    }
}
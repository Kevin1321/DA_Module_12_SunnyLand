/**
 * @fileoverview Definiert alle Kollisions-Layer des Spiels als unveränderliches Objekt.
 * @module CollisionLayers
 */

/**
 * Enum-artiges Objekt das alle verfügbaren Kollisions-Layer enthält.
 * Wird von {@link GameObject} verwendet um zu definieren mit welchen Layern
 * ein Objekt kollidieren kann.
 * Eingefroren mit {@link Object.freeze} um versehentliche Änderungen zu verhindern.
 * @readonly
 * @enum {string}
 */
const CollisionLayers = Object.freeze({
    /** Standard-Layer für generische Objekte. */
    DEFAULT: "default",
    /** Layer für den Spieler. */
    PLAYER: "player",
    /** Layer für Gegner (Minions, Boss). */
    ENEMY: "enemy",
    /** Layer für einsammelbare Objekte (Kirschen, Edelsteine). */
    PICKUP: "pickup",
    /** Layer für Projektile des Spielers. */
    PROJECTILE: "projectile",
    /** Layer für das Zielobjekt am Levelende. */
    GOAL: "goal"
});
/**
 * @fileoverview Defines all collision layers used in the game as an immutable object.
 * @module CollisionLayers
 */

/**
 * Enum-like object containing all available collision layers.
 * Used by {@link GameObject} to define which collision layer an object belongs to.
 * Frozen with {@link Object.freeze} to prevent accidental modifications.
 * @readonly
 * @enum {string}
 */
const CollisionLayers = Object.freeze({
    /** Default layer for generic objects. */
    DEFAULT: "default",
    /** Layer for the player. */
    PLAYER: "player",
    /** Layer for enemies (minions and bosses). */
    ENEMY: "enemy",
    /** Layer for collectible objects (cherries and gems). */
    PICKUP: "pickup",
    /** Layer for player projectiles. */
    PROJECTILE: "projectile",
    /** Layer for the level's goal object. */
    GOAL: "goal"
});
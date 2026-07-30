/**
 * @fileoverview Collection of general utility functions.
 * @module Util
 */

/**
 * Static helper class containing general utility methods
 * used throughout the game.
 */
class Util {

    /**
     * Clamps a value to a specific range.
     * @static
     * @param {number} value - The value to clamp.
     * @param {number} min - The minimum allowed value.
     * @param {number} max - The maximum allowed value.
     * @returns {number} The clamped value within [min, max].
     * @example
     * Util.Clamp(15, 0, 10); // returns 10
     * Util.Clamp(-5, 0, 10); // returns 0
     * Util.Clamp(5, 0, 10);  // returns 5
     */
    static Clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Returns a random normalized number between -1.0 and 1.0.
     * @static
     * @returns {number} Random value in the range [-1.0, 1.0] with one decimal place.
     */
    static GetRandomNormalized() {
        return (Math.random() * 2 - 1).toFixed(1);
    }

    /**
     * Returns a random number within a specified range.
     * @static
     * @param {number} min - Lower bound of the range (inclusive).
     * @param {number} max - Upper bound of the range (exclusive).
     * @returns {number} Random value in the range [min, max).
     * @example
     * Util.GetRandomRange(0, 100); // e.g. 42.7
     * Util.GetRandomRange(200, 300); // e.g. 263.4
     */
    static GetRandomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}
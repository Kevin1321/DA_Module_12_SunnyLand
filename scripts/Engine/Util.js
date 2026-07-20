/**
 * @fileoverview Sammlung allgemeiner Hilfsfunktionen.
 * @module Util
 */

/**
 * Statische Hilfsklasse mit allgemeinen Utility-Methoden
 * die im gesamten Spiel verwendet werden.
 */
class Util {

    /**
     * Begrenzt einen Wert auf einen bestimmten Bereich.
     * @static
     * @param {number} value - Der zu begrenzende Wert.
     * @param {number} min - Der minimale erlaubte Wert.
     * @param {number} max - Der maximale erlaubte Wert.
     * @returns {number} Der begrenzte Wert innerhalb von [min, max].
     * @example
     * Util.Clamp(15, 0, 10); // returns 10
     * Util.Clamp(-5, 0, 10); // returns 0
     * Util.Clamp(5, 0, 10);  // returns 5
     */
    static Clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Gibt eine zufällige normalisierte Zahl zwischen -1.0 und 1.0 zurück.
     * @static
     * @returns {number} Zufälliger Wert im Bereich [-1.0, 1.0] mit einer Dezimalstelle.
     */
    static GetRandomNormalized() {
        return (Math.random() * 2 - 1).toFixed(1);
    }

    /**
     * Gibt eine zufällige Zahl innerhalb eines bestimmten Bereichs zurück.
     * @static
     * @param {number} min - Untere Grenze des Bereichs (inklusive).
     * @param {number} max - Obere Grenze des Bereichs (exklusive).
     * @returns {number} Zufälliger Wert im Bereich [min, max).
     * @example
     * Util.GetRandomRange(0, 100); // z.B. 42.7
     * Util.GetRandomRange(200, 300); // z.B. 263.4
     */
    static GetRandomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}
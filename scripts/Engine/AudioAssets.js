/**
 * @fileoverview Enthält alle Audio-Assets des Spiels als statische Eigenschaften.
 * @module AudioAssets
 */

/**
 * Zentrale Sammlung aller Audio-Assets.
 * Alle Sounds werden beim Laden der Klasse direkt als {@link HTMLAudioElement} initialisiert.
 */
class AudioAssets {

    /**
     * Hintergrundmusik des Spiels.
     * @static
     * @type {HTMLAudioElement}
     */
    static BACKGROUND_MUSIC = new Audio("assets/audio/the_valley.ogg");

    /**
     * Sound-Effekt für den Sprung des Spielers.
     * @static
     * @type {HTMLAudioElement}
     */
    static JUMP = new Audio("assets/audio/effects/jump.ogg");

    /**
     * Sound-Effekt beim Einsammeln eines Items.
     * @static
     * @type {HTMLAudioElement}
     */
    static ITEM = new Audio("assets/audio/effects/item.ogg");

    /**
     * Sound-Effekt wenn der Spieler Schaden nimmt.
     * @static
     * @type {HTMLAudioElement}
     */
    static HURT = new Audio("assets/audio/effects/hurt.ogg");

    /**
     * Sound-Effekt beim Tod eines Gegners.
     * @static
     * @type {HTMLAudioElement}
     */
    static ENEMY_DEATH = new Audio("assets/audio/effects/enemy-death.ogg");

    /**
     * Array aller Sound-Assets — wird vom {@link AudioManager} für globale Operationen
     * wie Stummschalten oder Lautstärkeregelung verwendet.
     * @static
     * @type {HTMLAudioElement[]}
     */
    static ALL_SOUNDS = [
        AudioAssets.BACKGROUND_MUSIC,
        AudioAssets.JUMP,
        AudioAssets.ITEM,
        AudioAssets.HURT,
        AudioAssets.ENEMY_DEATH
    ];
}
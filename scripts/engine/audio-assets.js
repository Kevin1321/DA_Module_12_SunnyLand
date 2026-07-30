/**
 * @fileoverview Contains all game audio assets as static properties.
 * @module AudioAssets
 */

/**
 * Central collection of all audio assets.
 * All sounds are initialized as {@link HTMLAudioElement} instances when the class is loaded.
 */
class AudioAssets {

    /**
     * Background music of the game.
     * @static
     * @type {HTMLAudioElement}
     */
    static BACKGROUND_MUSIC = new Audio("assets/audio/the_valley.ogg");

    /**
    * Background music of the boss fight.
    * @static
    * @type {HTMLAudioElement}
    */
    static BOSS_MUSIC = new Audio("assets/audio/nyxaurora-final-battle-epic-orchestral-action-background-music-361154.mp3");

    /**
         * Sound effect played when the projectile hits an enemy.
         * @static
         * @type {HTMLAudioElement}
         */
    static PROJECTILE_SHOOT = new Audio("assets/audio/effects/floraphonic-metal-whoosh-hit-4-201906.mp3");

    /**
     * Sound effect played when the projectile hits an enemy.
     * @static
     * @type {HTMLAudioElement}
     */
    static PROJECTILE_HIT = new Audio("assets/audio/effects/floraphonic-metal-whoosh-hit-5-201907.mp3");

    /**
     * Sound effect played when the player wins.
     * @static
     * @type {HTMLAudioElement}
     */
    static VICTORY = new Audio("assets/audio/effects/u_o8xh7gwsrj-cute_happy_victory-476376.mp3");


    /**
     * Sound effect played when the player wins.
     * @static
     * @type {HTMLAudioElement}
     */
    static GAME_OVER = new Audio("assets/audio/effects/mori_sound-fx-lose-cartoon-521523.mp3");

    /**
     * Sound effect played when the player jumps.
     * @static
     * @type {HTMLAudioElement}
     */
    static JUMP = new Audio("assets/audio/effects/jump.ogg");

    /**
     * Sound effect played when the player collects an item.
     * @static
     * @type {HTMLAudioElement}
     */
    static ITEM = new Audio("assets/audio/effects/item.ogg");

    /**
     * Sound effect played when the player takes damage.
     * @static
     * @type {HTMLAudioElement}
     */
    static HURT = new Audio("assets/audio/effects/hurt.ogg");

    /**
     * Sound effect played when an enemy dies.
     * @static
     * @type {HTMLAudioElement}
     */
    static ENEMY_DEATH = new Audio("assets/audio/effects/enemy-death.ogg");

    /**
     * Array containing all audio assets.
     * Used by the {@link AudioManager} for global operations such as muting
     * or adjusting the volume.
     * @static
     * @type {HTMLAudioElement[]}
     */
    static ALL_SOUNDS = [
        AudioAssets.BACKGROUND_MUSIC,
        AudioAssets.BOSS_MUSIC,
        AudioAssets.PROJECTILE_SHOOT,
        AudioAssets.PROJECTILE_HIT,
        AudioAssets.VICTORY,
        AudioAssets.GAME_OVER,
        AudioAssets.JUMP,
        AudioAssets.ITEM,
        AudioAssets.HURT,
        AudioAssets.ENEMY_DEATH
    ];
}
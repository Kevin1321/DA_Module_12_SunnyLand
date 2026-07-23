/**
 * @fileoverview Manages the game's audio playback, volume, and mute state.
 * Persists user settings in localStorage.
 * @module AudioManager
 */

/**
 * Static class for centralized audio management.
 * Automatically loads and stores user settings in {@link localStorage}.
 */
class AudioManager {

    /**
     * Indicates whether audio is currently muted.
     * Loaded from localStorage.
     * @static
     * @type {boolean}
     */
    static isMuted = localStorage.getItem('isMuted') === 'true';

    /**
     * The current audio volume (0.0–1.0).
     * Loaded from localStorage. Defaults to 0.1.
     * @static
     * @type {number}
     */
    static currentVolume = parseFloat(localStorage.getItem('volume')) || 0.1;

    /**
     * Plays a sound, always restarting playback from the beginning.
     * @static
     * @param {HTMLAudioElement} sound - The sound from {@link AudioAssets} to play.
     * @param {boolean} [isLooping=false] - Whether the sound should loop.
     */
    static Play(sound, isLooping) {
        sound.volume = AudioManager.isMuted ? 0 : AudioManager.currentVolume;
        sound.currentTime = 0;
        sound.loop = isLooping;
        sound.play();
    }

    /**
     * Pauses all sounds in {@link AudioAssets.ALL_SOUNDS}.
     * @static
     */
    static StopAll() {
        AudioAssets.ALL_SOUNDS.forEach(sound => sound.pause());
    }

    /**
     * Pauses a single sound.
     * @static
     * @param {HTMLAudioElement} sound - The sound to pause.
     */
    static Stop(sound) {
        sound.pause();
    }

    /**
     * Sets the volume for all sounds and stores the value in localStorage.
     * If audio is muted, the volume remains at 0.
     * @static
     * @param {number} value - The new volume (0.0–1.0).
     */
    static SetVolume(value) {
        AudioManager.currentVolume = value;
        localStorage.setItem('volume', value);
        AudioAssets.ALL_SOUNDS.forEach(sound => {
            sound.volume = AudioManager.isMuted ? 0 : value;
        });
    }

    /**
     * Toggles the mute state and updates the mute button icons.
     * Stores the new state in localStorage.
     * @static
     */
    static ToggleMute() {
        AudioManager.isMuted = !AudioManager.isMuted;
        localStorage.setItem('isMuted', AudioManager.isMuted);
        AudioAssets.ALL_SOUNDS.forEach(sound => {
            sound.volume = AudioManager.isMuted ? 0 : AudioManager.currentVolume;
        });
        document.getElementById('mute-btn').src = AudioManager.isMuted
            ? "assets/sprites/UI/audio-disabled.png"
            : "assets/sprites/UI/audio-enabled.png";
        document.getElementById('fs-mute-btn').src = AudioManager.isMuted
            ? "assets/sprites/UI/audio-disabled.png"
            : "assets/sprites/UI/audio-enabled.png";

    }

    /**
     * Initializes the audio UI (volume slider and mute button)
     * using the settings stored in localStorage.
     * @static
     */
    static Init() {
        document.getElementById('volume-slider').value = AudioManager.currentVolume;
        document.getElementById('mute-btn').src = AudioManager.isMuted
            ? "assets/sprites/UI/audio-disabled.png"
            : "assets/sprites/UI/audio-enabled.png";
        document.getElementById('fs-mute-btn').src = AudioManager.isMuted
            ? "assets/sprites/UI/audio-disabled.png"
            : "assets/sprites/UI/audio-enabled.png";
    }
}
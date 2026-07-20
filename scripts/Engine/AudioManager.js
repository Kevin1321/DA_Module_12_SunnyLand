/**
 * @fileoverview Verwaltet die Audiowiedergabe, Lautstärke und Stummschaltung des Spiels.
 * Persistiert Einstellungen im localStorage.
 * @module AudioManager
 */

/**
 * Statische Klasse zur zentralen Steuerung aller Audio-Funktionen.
 * Liest und speichert Benutzereinstellungen automatisch im {@link localStorage}.
 */
class AudioManager {

    /**
     * Gibt an ob der Ton aktuell stummgeschaltet ist.
     * Wird aus dem localStorage geladen.
     * @static
     * @type {boolean}
     */
    static isMuted = localStorage.getItem('isMuted') === 'true';

    /**
     * Die aktuelle Lautstärke (0.0 – 1.0).
     * Wird aus dem localStorage geladen, Standard ist 0.1.
     * @static
     * @type {number}
     */
    static currentVolume = parseFloat(localStorage.getItem('volume')) || 0.1;

    /**
     * Spielt einen Sound ab. Setzt die Wiedergabe immer von vorne.
     * @static
     * @param {HTMLAudioElement} sound - Der abzuspielende Sound aus {@link AudioAssets}.
     * @param {boolean} [isLooping=false] - Ob der Sound in einer Schleife abgespielt werden soll.
     */
    static Play(sound, isLooping) {
        sound.volume = AudioManager.isMuted ? 0 : AudioManager.currentVolume;
        sound.currentTime = 0;
        sound.loop = isLooping;
        sound.play();
    }

    /**
     * Pausiert alle Sounds aus {@link AudioAssets.ALL_SOUNDS}.
     * @static
     */
    static StopAll() {
        AudioAssets.ALL_SOUNDS.forEach(sound => sound.pause());
    }

    /**
     * Pausiert einen einzelnen Sound.
     * @static
     * @param {HTMLAudioElement} sound - Der zu pausierenede Sound.
     */
    static Stop(sound) {
        sound.pause();
    }

    /**
     * Setzt die Lautstärke aller Sounds und speichert den Wert im localStorage.
     * Bei aktivierter Stummschaltung bleibt die Lautstärke bei 0.
     * @static
     * @param {number} value - Neue Lautstärke (0.0 – 1.0).
     */
    static SetVolume(value) {
        AudioManager.currentVolume = value;
        localStorage.setItem('volume', value);
        AudioAssets.ALL_SOUNDS.forEach(sound => {
            sound.volume = AudioManager.isMuted ? 0 : value;
        });
    }

    /**
     * Schaltet die Stummschaltung um und aktualisiert das Mute-Button-Icon.
     * Speichert den neuen Zustand im localStorage.
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
    }

    /**
     * Initialisiert die Audio-UI (Lautstärkeregler und Mute-Button) 
     * anhand der gespeicherten Einstellungen aus dem localStorage.
     * @static
     */
    static Init() {
        document.getElementById('volume-slider').value = AudioManager.currentVolume;
        document.getElementById('mute-btn').src = AudioManager.isMuted
            ? "assets/sprites/UI/audio-disabled.png"
            : "assets/sprites/UI/audio-enabled.png";
    }
}
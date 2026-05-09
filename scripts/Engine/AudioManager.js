class AudioManager {
    static Play(sound, isLooping) {
        sound.volume = 0.1;
        sound.currentTime = 0;
        sound.loop = isLooping;

        document.addEventListener("click", () => {
            sound.play();
        }, { once: true });

    }

    static StopAll() {
        AudioHub.ALL_SOUNDS.forEach(sound => {
            sound.pause();
        });
        //document.getElementById('volume').value = 0.2;  // Setzt den Sound-Slider wieder auf 0.2
    }

    static Stop(sound) {
        sound.pause();
    }

    static SetVolumeFromSlider(volumeSlider) {
        /*let volumeValue = document.getElementById('volume').value;  // Holt den aktuellen Lautstärkewert aus dem Inputfeld
        volumeSlider.forEach(sound => {
            sound.volume = volumeValue;  // Setzt die Lautstärke für jedes Audio wie im Slider angegeben
        });*/
    }
}
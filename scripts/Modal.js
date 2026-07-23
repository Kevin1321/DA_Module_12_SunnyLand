/**
 * @fileoverview Contains the modal texts and controls the UI for
 * displaying and hiding modal windows.
 * @module Modal
 */

/**
 * Collection of all modal contents used by the game UI.
 * Contains texts for the How To Play section, licenses and imprint.
 */
const modalTexts = {
    howToPlay: `
    <h2>How to Play</h2>

    <h3>Movement</h3>
    <table>
        <tr><td><kbd>A</kbd></td><td>Move left</td></tr>
        <tr><td><kbd>D</kbd></td><td>Move right</td></tr>
        <tr><td><kbd>Space</kbd></td><td>Jump</td></tr>
        <tr><td><kbd>Q</kbd></td><td>Shoot</td></tr>
    </table>

    <h3>Objective</h3>
    <p>Reach the house at the end of the level and defeat the boss to win. Collect cherries and gems along the way!</p>

    <h3>Warning</h3>
    <p>Minions deal <strong>0.5</strong> damage, the boss deals <strong>1</strong> damage. You have <strong>5 lives</strong> — be careful!</p>
`,
    licences: `
                Game Art and Audio made by: <br>
                <a href="https://linktr.ee/ansimuz">https://linktr.ee/ansimuz</a><br>
                <br>
                UI Elements made by:<br>
                <a href="https://toffeecraft.itch.io/">https://toffeecraft.itch.io/</a><br>
    `,
    imprint: `
        <h2>Imprint</h2>
        <p>Responsible for this website:</p>
        <p>Kevin Reich<br>
        Basedowstraße 14<br>
        39104 Magdeburg<br>
        Germany<br>
        E-Mail: <a href="">kevinreich1321@gmail.com</a></p>
        <h3>Notice</h3>
        <p>This project is a non-commercial hobby project and is intended for entertainment purposes only.</p>
    `
};

/**
 * Opens a modal window and displays the selected content.
 * 
 * @param {string} type - The key of the modal content inside {@link modalTexts}.
 */
function openModal(type) {
    document.getElementById('modal-text').innerHTML = modalTexts[type];
    document.getElementById('modal-overlay').classList.add('open');
}

/**
 * Closes the currently opened modal window.
 */
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
}
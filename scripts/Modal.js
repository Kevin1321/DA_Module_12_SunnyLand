const modalTexts = {
    howToPlay: `
    <h2>How to Play</h2>

    <h3>Bewegung</h3>
    <table>
        <tr><td><kbd>A</kbd></td><td>Links bewegen</td></tr>
        <tr><td><kbd>D</kbd></td><td>Rechts bewegen</td></tr>
        <tr><td><kbd>Space</kbd></td><td>Springen</td></tr>
        <tr><td><kbd>Q</kbd></td><td>Schießen</td></tr>
    </table>

    <h3>Ziel</h3>
    <p>Erreiche das Haus am Ende des Levels und besiege den Boss um zu gewinnen. Sammle unterwegs Kirschen und Edelsteine!</p>

    <h3>Achtung</h3>
    <p>Minions verursachen <strong>0.5</strong> Schaden, der Boss verursacht <strong>1</strong> Schaden. Du hast <strong>5 Leben</strong> — pass auf dich auf!</p>
`,
    licences: ` Game Art and Audio made by: <br>
                <a href="https://linktr.ee/ansimuz">https://linktr.ee/ansimuz</a><br>
                <br>
                UI Elements made by:<br>
                <a href="https://toffeecraft.itch.io/">https://toffeecraft.itch.io/</a><br> 
    `,
    imprint: `
        <h2>Impressum</h2>
        <p>Verantwortlich für diese Website:</p>
        <p>Kevin Reich<br>
        Basedowstraße 14<br>
        39104 Magdeburg<br>
        Deutschland<br>
        E-Mail: <a href="">kevinreich1321@gmail.com</a></p>
        <h3>Hinweis</h3>
        <p>Dieses Projekt ist ein nicht-kommerzielles Hobbyprojekt und dient ausschließlich zu Unterhaltungszwecken.</p>
    `
};

function openModal(type) {
    document.getElementById('modal-text').innerHTML = modalTexts[type];
    document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
}
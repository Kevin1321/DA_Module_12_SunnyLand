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
    licences: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    imprint: `
        <h2>Impressum</h2>
        <p>Verantwortlich für diese Website:</p>
        <p>Max Mustermann<br>
        Musterstraße 12<br>
        12345 Musterstadt<br>
        Deutschland<br>
        E-Mail: <a href="mailto:kontakt@beispiel.de">kontakt@beispiel.de</a></p>

        <h3>Verwendete Ressourcen</h3>
        <p>Dieses Mini-Game verwendet Inhalte und Ressourcen von Drittanbietern:</p>
        <ul>
            <li>[Name der Ressource] – [Lizenz]</li>
            <li>[Name der Ressource] – [Lizenz]</li>
            <li>[Name der Ressource] – [Lizenz]</li>
        </ul>

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
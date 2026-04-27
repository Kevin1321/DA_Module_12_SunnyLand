class World {
    context;

    character = new Character();

    enemies = [
        new Enemy(150, 64),
        new Enemy(200, 64),
        new Enemy(250, 64)
    ];

    constructor(canvas) {
        this.context = canvas.getContext('2d');
        this.draw = this.draw.bind(this);
        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, canvas.widht, canvas.height);

        this.context.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);

        this.enemies.forEach(enemy => {
            this.context.drawImage(this.enemies[0].img, enemy.x, enemy.y, enemy.width, enemy.height);
        });


        requestAnimationFrame(this.draw);
    }
}
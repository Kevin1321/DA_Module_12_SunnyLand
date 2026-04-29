class World {
    context;
    lastTime;
    gameObjects = [];

    constructor(canvas) {
        this.CreateGameObjects();
        this.context = canvas.getContext('2d');
        this.Tick = this.Tick.bind(this);
        this.Tick();
    }

    Tick(now) {
        requestAnimationFrame(this.Tick);

        if (!this.lastTime) {
            this.lastTime = now;
        }

        let deltaTime = now - this.lastTime;
        this.OnTick(deltaTime);
        this.lastTime = now;
    }

    OnTick(deltaTime) {
        this.gameObjects.forEach(gameObject => {
            gameObject.OnTick(deltaTime);
        });
    }

    CreateGameObjects() {
        this.minion = new Minion(0, 0, 0, 0);
        this.player = new Player(0, 0, 0, 0);

        this.gameObjects.push(this.player);
        this.gameObjects.push(this.minion);
    }
}
class World {
    context;
    lastTime;
    //requiredElapsed = 1000 / 10; // desired interval is 10fps
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

        /*if (elapsed > requiredElapsed) { Uncomment if we need to limit the framerate ourselves
            // do stuff
            lastTime = now;
        }*/ 
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
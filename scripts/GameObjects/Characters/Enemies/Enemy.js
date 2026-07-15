class Enemy extends Character {
    EnemyState = Object.freeze({
        IDLE: "idle",
        MOVE: "move",
        ATTACK: "attack"
    });

    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.health = 1;
        this.layer = CollisionLayers.ENEMY;
        this.collidableLayers = [CollisionLayers.PLAYER, CollisionLayers.PROJECTILE];
    }

    OnTick(deltaTime) {
        super.OnTick(deltaTime);
    }

    Animate(deltaTime) {
        super.Animate(deltaTime);
    }

    TakeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) this.EnemyDead();
    }

    EnemyDead() {
        console.log('Enemy died');
    }
}
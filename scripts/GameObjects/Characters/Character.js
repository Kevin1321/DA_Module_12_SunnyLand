class Character extends GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.maxHealth = 0;
        this.health = 0;
        this.isDead = false;
    }

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);
    }

    Animate(frame) {
    }

    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
    }

    OnCollision(collider) {
        super.OnCollision(collider);
    }

    OnCollisionExit(collider) {
        super.OnCollisionExit(collider);
    }

    TakeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.isDead = this.health == 0;
    }
}
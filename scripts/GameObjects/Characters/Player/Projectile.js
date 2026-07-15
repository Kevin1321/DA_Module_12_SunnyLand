class Projectile extends GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        super(context, positionX, positionY, sizeX, sizeY);

        this.layer = CollisionLayers.PROJECTILE;
        this.collidableLayers = [CollisionLayers.ENEMY];

        this.img.src = SpriteAssets.PROJECTILS.STAR;
        this.lifetime = 3;
        this.projectileSpeed = 200;
        this.currentTimeAlife = 0;
        this.isBeingShot = false;
        this.direction = 1;
    }

    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        if (this.isBeingShot) {
            this.positionX += this.projectileSpeed * this.direction * deltaTime;
            this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);
            this.currentTimeAlife += deltaTime;

            if (this.currentTimeAlife >= this.lifetime) {
                this.ResetProjectile();
            }
        }
    }

    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);
        if (collider instanceof Enemy) {
            console.log('enemy hit');

            collider.TakeDamage(1);
            this.ResetProjectile();
        }
    }

    Shoot(startPositionX, startPositionY, direction) {
        this.isBeingShot = true;
        this.positionX = startPositionX;
        this.positionY = startPositionY;
        this.direction = direction
    }

    ResetProjectile() {
        this.currentTimeAlife = 0;
        this.isBeingShot = false;
        this.positionX = -500;
        this.positionY = -500;
    }
}
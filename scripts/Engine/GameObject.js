class GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.img = new Image(this.sizeY, this.sizeX);
    }

    SetAnimationFrame(animationFrameSrc) {
        this.img.src = animationFrameSrc;
    }

    OnTick(frame, deltaTime) {
        this.DrawCollisionRect();
    }

    OnCollisionEnter(collider) {
    }

    OnCollision(collider) {
    }

    OnCollisionExit(collider) {
    }

    DrawCollisionRect() {
        this.context.beginPath();
        this.context.lineWidth = "2";
        this.context.strokeStyle = "green";
        this.context.rect(this.positionX, this.positionY, this.sizeX, this.sizeY);
        this.context.stroke();
    }
}
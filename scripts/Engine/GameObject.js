class GameObject {
    constructor(context, positionX, positionY, sizeX, sizeY) {
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.img = new Image(this.sizeY, this.sizeX);
        this.collisionOffset = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    }

    SetAnimationFrame(animationFrameSrc) {
        this.img.src = animationFrameSrc;
    }

    OnTick(frame, deltaTime) {
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
        this.context.rect(
            this.positionX + this.collisionOffset.left, 
            this.positionY + this.collisionOffset.top, 
            this.sizeX - this.collisionOffset.right, 
            this.sizeY - this.collisionOffset.bottom);
        this.context.stroke();
    }
}
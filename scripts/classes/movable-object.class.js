class MovableObject {
    x = 64;
    y = 64;
    img;
    height = 32;
    widht = 32;

    loadImage(path) {
        this.img = new Image(this.height, this.widht);
        this.img.src = path;
    }

    moveRight() {
        console.log('move right');
    }

    moveLeft() {
        console.log('move left');
    }
}
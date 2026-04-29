class MovableObject {
    x = 0;
    y = 340;
    img;
    height = 64;
    width = 64;

    loadImage(path) {
        this.img = new Image(this.height, this.width);
        this.img.src = path;
    }

    moveRight() {
        console.log('move right');
    }

    moveLeft() {
        console.log('move left');
    }
}
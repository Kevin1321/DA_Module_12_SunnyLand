class Animation {
    paths = [];
    currentAnimationFrame = 0;
    constructor(pathArray){
        this.paths = pathArray;
    }

    nextFrame() {
        return paths[this.currentAnimationFrame];
    }
}
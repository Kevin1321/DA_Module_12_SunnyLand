class Animation {
    paths = [];
    currentAnimationFrame = 0;

    constructor(pathArray){
        this.paths = pathArray;
    }

    nextFrame() {
        let returnIndex = this.currentAnimationFrame;
        this.currentAnimationFrame++;
        if(this.currentAnimationFrame >= this.paths.length) this.currentAnimationFrame = 0;

        return this.paths[returnIndex];
    }
}
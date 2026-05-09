class Animation extends EventTarget{

    constructor(pathArray) {
        super();
        this.paths = pathArray;
        this.currentAnimationFrame = 0;
        this.endOfAnimationEvent = new Event("EndOfAnimation")
    }

    nextFrame() {
        let returnIndex = this.currentAnimationFrame;
        this.currentAnimationFrame++;
        if (this.currentAnimationFrame >= this.paths.length) {
            this.dispatchEvent(this.endOfAnimationEvent);
            this.currentAnimationFrame = 0;
        }

        return this.paths[returnIndex];
    }
}
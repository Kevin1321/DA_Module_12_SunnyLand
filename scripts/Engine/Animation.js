class Animation extends EventTarget {

    constructor(pathArray, fps = 10) {
        super();
        this.fps = fps;
        this.timer = 0;
        this.currentAnimationFrame = 0;
        this.endOfAnimationEvent = new Event("EndOfAnimation");

        this.frames = pathArray.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
    }

    nextFrame(deltaTime) {
        this.timer += deltaTime;

        if (this.timer >= 1 / this.fps) {
            this.timer = 0;
            this.currentAnimationFrame++;

            if (this.currentAnimationFrame >= this.frames.length) {
                this.dispatchEvent(this.endOfAnimationEvent);
                this.currentAnimationFrame = 0;
            }
        }

        return this.frames[this.currentAnimationFrame];
    }
}
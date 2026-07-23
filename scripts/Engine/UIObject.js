/**
 * @fileoverview Base class for all UI objects rendered on the canvas.
 * @module UIObject
 */

/**
 * Base class for all UI objects.
 * Unlike {@link GameObject}, UIObjects are camera-bound —
 * they are always rendered relative to the current camera position
 * and therefore remain fixed on the screen.
 */
class UIObject {

    /**
     * Creates a new UIObject.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {{ x: number, y: number }} camera - The current camera position of the world.
     */
    constructor(context, camera) {
        this.context = context;
        this.camera = camera;
    }

    /**
     * Called every frame by {@link World#UpdateUIObjects}.
     * Can be overridden by subclasses to implement UI logic and rendering.
     * @param {number} deltaTime - Time in seconds since the previous frame.
     */
    OnTick(deltaTime) {
    }
}
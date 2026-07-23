/**
 * @fileoverview Implements the player's Heads-Up Display (HUD).
 * @module PlayerHUD
 */

/**
 * The player's Heads-Up Display.
 * Extends {@link UIObject} and renders the health bar, portrait, item slots,
 * as well as counters for collected cherries and gems.
 * Created by {@link World#CreateUI} and updated every frame via {@link World#UpdateUIObjects}.
 * @extends UIObject
 */
class PlayerHUD extends UIObject {

    /**
     * Creates a new PlayerHUD.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     * @param {{ x: number, y: number }} camera - The current camera position of the world.
     * @param {Player} player - The player whose data is displayed.
     */
    constructor(context, camera, player) {
        super(context, camera);
        this.player = player;

        /** @type {number} Horizontal spacing between hearts in pixels. */
        this.heartXOffset = 20;

        /** @type {number} Horizontal offset of the Foxy portrait in pixels. */
        this.foxyPortaitXOffset = 28;

        /** @type {number} Vertical offset of the Foxy portrait in pixels. */
        this.foxyPortaitYOffest = 24;

        this.fingerPaint = new FontFace(
            "FingerPaint",
            "url('assets/fonts/Finger_Paint/FingerPaint-Regular.ttf')"
        );

        this.fingerPaint.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
            this.context.font = "30px FingerPaint";
            this.context.fillStyle = "#2c2122";
        });

        this.CreateFrame();
        this.CreateFoxyPortrait();
        this.CreateEmptyHeart();
        this.CreateFullHeart();
        this.CreateHalfHeart();
        this.CreateItemSlot();
        this.CreateCherry();
        this.CreateGem();
    }

    /**
     * Called every frame.
     * Renders all HUD elements relative to the camera position onto the canvas.
     * @param {number} deltaTime - Time in seconds since the last frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.context.drawImage(this.frame, this.camera.x, this.camera.y, this.frame.width, this.frame.height);
        this.context.drawImage(this.foxyPortait, this.camera.x + this.foxyPortaitXOffset, this.camera.y + this.foxyPortaitYOffest, this.foxyPortait.width, this.foxyPortait.height);
        this.DrawEmptyHearts();
        this.DrawFullHearts();
        this.DrawItemSlots();
        this.DrawCherry();
        this.DrawGem();
    }

    /**
     * Loads and initializes the HUD frame sprite.
     */
    CreateFrame() {
        this.frame = new Image(96, 96);
        this.frame.src = SpriteAssets.UI.PLAYER_HUD.FRAME;
    }

    /**
     * Loads and initializes the Foxy portrait sprite.
     */
    CreateFoxyPortrait() {
        this.foxyPortait = new Image(48, 48);
        this.foxyPortait.src = SpriteAssets.UI.PLAYER_HUD.FOXY_PORTAIT;
    }

    /**
     * Loads and initializes the empty heart sprite.
     */
    CreateEmptyHeart() {
        this.emptyHeart = new Image(64, 64);
        this.emptyHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_EMPTY;
    }

    /**
     * Loads and initializes the full heart sprite.
     */
    CreateFullHeart() {
        this.fullHeart = new Image(64, 64);
        this.fullHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_FULL;
    }

    /**
     * Loads and initializes the half heart sprite.
     * Displayed when the player has half a health point.
     */
    CreateHalfHeart() {
        this.halfHeart = new Image(64, 64);
        this.halfHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_HALF;
    }

    /**
     * Loads and initializes the item slot sprite.
     */
    CreateItemSlot() {
        this.itemSlot = new Image(48, 48);
        this.itemSlot.src = SpriteAssets.UI.PLAYER_HUD.ITEM_SLOT;
    }

    /**
     * Loads and initializes the cherry sprite for the item slot.
     */
    CreateCherry() {
        this.cherry = new Image(24, 24);
        this.cherry.src = SpriteAssets.PICK_UPS.CHERRY_1;
    }

    /**
     * Loads and initializes the gem sprite for the item slot.
     */
    CreateGem() {
        this.gem = new Image(24, 24);
        this.gem.src = SpriteAssets.PICK_UPS.GEM_1;
    }

    /**
     * Draws empty hearts for all of the player's maximum health points.
     * Serves as the background for the full hearts.
     */
    DrawEmptyHearts() {
        for (let index = 0; index < this.player.maxHealth; index++) {
            this.context.drawImage(
                this.emptyHeart,
                (this.camera.x + this.frame.width + ((this.emptyHeart.width - this.heartXOffset) * index)),
                0,
                this.emptyHeart.width,
                this.emptyHeart.height
            );
        }
    }

    /**
     * Draws full and half hearts based on the player's current health.
     * Uses the half heart sprite when the player has half a health point.
     */
    DrawFullHearts() {
        for (let index = 0; index < this.player.health; index++) {
            if (this.player.health % 1 !== 0 && index == this.player.health - .5) {
                this.context.drawImage(this.halfHeart, (this.camera.x + this.frame.width + ((this.halfHeart.width - this.heartXOffset) * index)), 0, this.halfHeart.width, this.halfHeart.height);
            } else {
                this.context.drawImage(this.fullHeart, (this.camera.x + this.frame.width + ((this.fullHeart.width - this.heartXOffset) * index)), 0, this.fullHeart.width, this.fullHeart.height);
            }
        }
    }

    /**
     * Draws two item slots below the health bar.
     * One for cherries and one for gems.
     */
    DrawItemSlots() {
        this.context.drawImage(this.itemSlot, this.camera.x + this.frame.width, this.camera.y + this.emptyHeart.height, this.itemSlot.width, this.itemSlot.height);
        this.context.drawImage(this.itemSlot, this.camera.x + this.frame.width + this.itemSlot.width, this.camera.y + this.emptyHeart.height, this.itemSlot.width, this.itemSlot.height);
    }

    /**
     * Draws the cherry icon and counter in the first item slot.
     * Not rendered if no cherries have been collected yet.
     */
    DrawCherry() {
        if (this.player.cherriesCollected <= 0) return;
        let positionX = this.camera.x + this.frame.width + 16;
        let positionY = this.camera.y + this.emptyHeart.height + 16;
        this.context.drawImage(this.cherry, positionX, positionY, this.cherry.width, this.cherry.height);
        this.context.fillText(this.player.cherriesCollected, positionX, positionY + 48);
    }

    /**
     * Draws the gem icon and counter in the second item slot.
     * Not rendered if no gems have been collected yet.
     */
    DrawGem() {
        if (this.player.gemsCollected <= 0) return;
        let positionX = this.camera.x + this.frame.width + this.itemSlot.width + 12;
        let positionY = this.camera.y + this.emptyHeart.height + 16;
        this.context.drawImage(this.gem, positionX, positionY, this.gem.width, this.gem.height);
        this.context.fillText(this.player.gemsCollected, positionX + 4, positionY + 48);
    }
}
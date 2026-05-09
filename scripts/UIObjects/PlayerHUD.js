class PlayerHUD extends UIObject {
    constructor(context, camera, player) {
        super(context, camera);
        this.player = player;
        this.heartXOffset = 20;
        this.foxyPortaitXOffset = 28;
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

    OnTick(frame, deltaTime) {
        super.OnTick(frame, deltaTime);

        this.context.drawImage(this.frame, this.camera.x, this.camera.y, this.frame.width, this.frame.height);
        this.context.drawImage(this.foxyPortait, this.camera.x + this.foxyPortaitXOffset, this.camera.y + this.foxyPortaitYOffest, this.foxyPortait.width, this.foxyPortait.height);
        this.DrawEmptyHearts();
        this.DrawFullHearts();
        this.DrawItemSlots();
        this.DrawCherry();
        this.DrawGem();
    }

    CreateFrame() {
        this.frame = new Image(96, 96);
        this.frame.src = SpriteAssets.UI.PLAYER_HUD.FRAME;
    }

    CreateFoxyPortrait() {
        this.foxyPortait = new Image(48, 48);
        this.foxyPortait.src = SpriteAssets.UI.PLAYER_HUD.FOXY_PORTAIT;
    }

    CreateEmptyHeart() {
        this.emptyHeart = new Image(64, 64);
        this.emptyHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_EMPTY;
    }

    CreateFullHeart() {
        this.fullHeart = new Image(64, 64);
        this.fullHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_FULL;
    }

    CreateHalfHeart() {
        this.halfHeart = new Image(64, 64);
        this.halfHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_HALF;
    }

    CreateItemSlot() {
        this.itemSlot = new Image(48, 48);
        this.itemSlot.src = SpriteAssets.UI.PLAYER_HUD.ITEM_SLOT;
    }

    CreateCherry() {
        this.cherry = new Image(24, 24);
        this.cherry.src = SpriteAssets.PICK_UPS.CHERRY_1;
    }

    CreateGem() {
        this.gem = new Image(24, 24);
        this.gem.src = SpriteAssets.PICK_UPS.GEM_1;
    }

    DrawEmptyHearts() {
        for (let index = 0; index < this.player.maxHealth; index++) {
            this.context.drawImage(this.emptyHeart, (this.camera.x + this.frame.width + ((this.emptyHeart.width - this.heartXOffset) * index)), 0, this.emptyHeart.width, this.emptyHeart.height);
        }
    }

    DrawFullHearts() {
        for (let index = 0; index < this.player.health; index++) {
            if (this.player.health % 1 !== 0 && index == this.player.health - .5) this.context.drawImage(this.halfHeart, (this.camera.x + this.frame.width + ((this.halfHeart.width - this.heartXOffset) * index)), 0, this.halfHeart.width, this.halfHeart.height);
            else this.context.drawImage(this.fullHeart, (this.camera.x + this.frame.width + ((this.fullHeart.width - this.heartXOffset) * index)), 0, this.fullHeart.width, this.fullHeart.height);
        }
    }

    DrawItemSlots() {
        this.context.drawImage(this.itemSlot, this.camera.x + this.frame.width, this.camera.y + this.emptyHeart.height, this.itemSlot.width, this.itemSlot.height);
        this.context.drawImage(this.itemSlot, this.camera.x + this.frame.width + this.itemSlot.width, this.camera.y + this.emptyHeart.height, this.itemSlot.width, this.itemSlot.height);
    }

    DrawCherry() {
        if (this.player.cherriesCollected <= 0) return;
        let positionX = this.camera.x + this.frame.width + 16;
        let positionY = this.camera.y + this.emptyHeart.height + 16;
        this.context.drawImage(this.cherry, positionX, positionY, this.cherry.width, this.cherry.height);

        
        let textYPosition = positionY + 48;
        this.context.fillText(this.player.cherriesCollected, positionX, textYPosition);
    }

    DrawGem() {
        if (this.player.gemsCollected <= 0) return;
        let positionX = this.camera.x + this.frame.width + this.itemSlot.width + 12;
        let positionY = this.camera.y + this.emptyHeart.height + 16;
        this.context.drawImage(this.gem, positionX, positionY, this.gem.width, this.gem.height);

        let textXPosition = positionX + 4;
        let textYPosition = positionY + 48;
        this.context.fillText(this.player.gemsCollected, textXPosition, textYPosition);
    }
}
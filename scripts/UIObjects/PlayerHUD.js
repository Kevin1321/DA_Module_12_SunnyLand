/**
 * @fileoverview Implementiert das Heads-Up-Display (HUD) des Spielers.
 * @module PlayerHUD
 */

/**
 * Das Heads-Up-Display des Spielers.
 * Erweitert {@link UIObject} und rendert Lebensanzeige, Portrait, Item-Slots
 * sowie Zähler für eingesammelte Kirschen und Edelsteine.
 * Wird von {@link World#CreateUI} erstellt und jeden Frame via {@link World#UpdateUIObjects} aktualisiert.
 * @extends UIObject
 */
class PlayerHUD extends UIObject {

    /**
     * Erstellt ein neues PlayerHUD.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {{ x: number, y: number }} camera - Die aktuelle Kameraposition der Welt.
     * @param {Player} player - Der Spieler dessen Daten angezeigt werden.
     */
    constructor(context, camera, player) {
        super(context, camera);
        this.player = player;

        /** @type {number} Horizontaler Abstand zwischen den Herzen in Pixeln. */
        this.heartXOffset = 20;

        /** @type {number} Horizontaler Versatz des Foxy-Portraits in Pixeln. */
        this.foxyPortaitXOffset = 28;

        /** @type {number} Vertikaler Versatz des Foxy-Portraits in Pixeln. */
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
     * Wird jeden Frame aufgerufen.
     * Rendert alle HUD-Elemente kamerarelativ auf den Canvas.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
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
     * Lädt und initialisiert das HUD-Rahmen-Sprite.
     */
    CreateFrame() {
        this.frame = new Image(96, 96);
        this.frame.src = SpriteAssets.UI.PLAYER_HUD.FRAME;
    }

    /**
     * Lädt und initialisiert das Foxy-Portrait-Sprite.
     */
    CreateFoxyPortrait() {
        this.foxyPortait = new Image(48, 48);
        this.foxyPortait.src = SpriteAssets.UI.PLAYER_HUD.FOXY_PORTAIT;
    }

    /**
     * Lädt und initialisiert das leere Herz-Sprite.
     */
    CreateEmptyHeart() {
        this.emptyHeart = new Image(64, 64);
        this.emptyHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_EMPTY;
    }

    /**
     * Lädt und initialisiert das volle Herz-Sprite.
     */
    CreateFullHeart() {
        this.fullHeart = new Image(64, 64);
        this.fullHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_FULL;
    }

    /**
     * Lädt und initialisiert das halbe Herz-Sprite.
     * Wird angezeigt wenn der Spieler einen halben Lebenspunkt hat.
     */
    CreateHalfHeart() {
        this.halfHeart = new Image(64, 64);
        this.halfHeart.src = SpriteAssets.UI.PLAYER_HUD.HEART_HALF;
    }

    /**
     * Lädt und initialisiert das Item-Slot-Sprite.
     */
    CreateItemSlot() {
        this.itemSlot = new Image(48, 48);
        this.itemSlot.src = SpriteAssets.UI.PLAYER_HUD.ITEM_SLOT;
    }

    /**
     * Lädt und initialisiert das Kirschen-Sprite für den Item-Slot.
     */
    CreateCherry() {
        this.cherry = new Image(24, 24);
        this.cherry.src = SpriteAssets.PICK_UPS.CHERRY_1;
    }

    /**
     * Lädt und initialisiert das Edelstein-Sprite für den Item-Slot.
     */
    CreateGem() {
        this.gem = new Image(24, 24);
        this.gem.src = SpriteAssets.PICK_UPS.GEM_1;
    }

    /**
     * Zeichnet leere Herzen für alle maximalen Lebenspunkte des Spielers.
     * Dient als Hintergrund für die vollen Herzen.
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
     * Zeichnet volle und halbe Herzen basierend auf der aktuellen Gesundheit des Spielers.
     * Bei einem halben Lebenspunkt wird das halbe Herz-Sprite verwendet.
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
     * Zeichnet zwei Item-Slots unterhalb der Herzleiste.
     * Einen für Kirschen und einen für Edelsteine.
     */
    DrawItemSlots() {
        this.context.drawImage(this.itemSlot, this.camera.x + this.frame.width, this.camera.y + this.emptyHeart.height, this.itemSlot.width, this.itemSlot.height);
        this.context.drawImage(this.itemSlot, this.camera.x + this.frame.width + this.itemSlot.width, this.camera.y + this.emptyHeart.height, this.itemSlot.width, this.itemSlot.height);
    }

    /**
     * Zeichnet das Kirschen-Icon und den Zähler im ersten Item-Slot.
     * Wird nicht gerendert wenn noch keine Kirschen eingesammelt wurden.
     */
    DrawCherry() {
        if (this.player.cherriesCollected <= 0) return;
        let positionX = this.camera.x + this.frame.width + 16;
        let positionY = this.camera.y + this.emptyHeart.height + 16;
        this.context.drawImage(this.cherry, positionX, positionY, this.cherry.width, this.cherry.height);
        this.context.fillText(this.player.cherriesCollected, positionX, positionY + 48);
    }

    /**
     * Zeichnet das Edelstein-Icon und den Zähler im zweiten Item-Slot.
     * Wird nicht gerendert wenn noch keine Edelsteine eingesammelt wurden.
     */
    DrawGem() {
        if (this.player.gemsCollected <= 0) return;
        let positionX = this.camera.x + this.frame.width + this.itemSlot.width + 12;
        let positionY = this.camera.y + this.emptyHeart.height + 16;
        this.context.drawImage(this.gem, positionX, positionY, this.gem.width, this.gem.height);
        this.context.fillText(this.player.gemsCollected, positionX + 4, positionY + 48);
    }
}
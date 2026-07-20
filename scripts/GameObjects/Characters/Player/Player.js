/**
 * @fileoverview Implementiert den vom Spieler kontrollierten Charakter (Foxy).
 * @module Player
 */

/**
 * Der vom Spieler kontrollierte Charakter.
 * Erweitert {@link Character} um Bewegung, Springen, Schießen, Kollisionsreaktionen
 * und Zustandsverwaltung. Liest Eingaben vom {@link InputManager}.
 * @extends Character
 */
class Player extends Character {

    /**
     * Enum der möglichen Zustände des Spielers.
     * @readonly
     * @enum {string}
     */
    PlayerState = Object.freeze({
        /** Spieler steht still. */
        IDLE: "idle",
        /** Spieler steht längere Zeit still. */
        LONG_IDLE: "longIdle",
        /** Spieler bewegt sich. */
        RUN: "run",
        /** Spieler ist in der Luft. */
        JUMP: "jump",
        /** Spieler ist tot. */
        DEAD: "dead",
        /** Spieler hat gewonnen. */
        VICTORY: "victory"
    });

    /**
     * Erstellt einen neuen Spieler.
     * @param {CanvasRenderingContext2D} context - Der Canvas-Rendering-Kontext.
     * @param {number} positionX - X-Startposition in Pixeln.
     * @param {number} positionY - Y-Startposition in Pixeln.
     * @param {number} sizeX - Breite in Pixeln.
     * @param {number} sizeY - Höhe in Pixeln.
     * @param {Projectile[]} projectilePool - Pool von wiederverwendbaren Projektilen.
     */
    constructor(context, positionX, positionY, sizeX, sizeY, projectilePool) {
        super(context, positionX, positionY, sizeX, sizeY);
        this.CreateAnimations();

        this.layer = CollisionLayers.PLAYER;
        this.collidableLayers = [CollisionLayers.ENEMY, CollisionLayers.PICKUP, CollisionLayers.GOAL];

        this.maxHealth = 5;
        this.health = 5;
        this.state = this.PlayerState.IDLE;

        /** @type {number} Akkumulierte Zeit in Sekunden die der Spieler still steht. */
        this.idleTime = 0;

        /** @type {number} Zeit in Millisekunden bis der Long-Idle-Zustand einsetzt. */
        this.longIdleTime = 10000;

        this.velocityY = 0;
        this.isGrounded = true;
        this.speed = 170;
        this.jumpSpeed = 13;
        this.gravity = 30;

        /** @type {number} Abklingzeit zwischen zwei Schüssen in Sekunden. */
        this.shootCooldown = .5;
        this.isShootOnCooldown = false;
        this.currentCooldownTime = 0;
        this.isMovingLeft = false;
        this.moveAmount = 0;

        /** @type {number} Anzahl der eingesammelten Edelsteine. */
        this.gemsCollected = 0;

        /** @type {number} Anzahl der eingesammelten Kirschen. */
        this.cherriesCollected = 0;

        /** @type {Projectile[]} Pool von wiederverwendbaren Projektilen. */
        this.projectilePool = projectilePool;

        this.collisionOffset = {
            top: 20,
            bottom: 20,
            left: 10,
            right: 20
        }

        this.jumpImg1 = new Image();
        this.jumpImg1.src = SpriteAssets.PLAYER.JUMP_1;

        this.jumpImg2 = new Image();
        this.jumpImg2.src = SpriteAssets.PLAYER.JUMP_2;

        this.playerDeadImg = new Image();
        this.playerDeadImg.src = SpriteAssets.PLAYER.DEAD;

        this.playerVictoryImg = new Image();
        this.playerVictoryImg.src = SpriteAssets.PLAYER.VICTORY;
    }

    /**
     * Reagiert auf den Beginn einer Kollision.
     * Sammelt Kirschen und Edelsteine ein und verursacht Schaden durch Gegner.
     * @param {GameObject} collider - Das Objekt mit dem die Kollision begonnen hat.
     */
    OnCollisionEnter(collider) {
        super.OnCollisionEnter(collider);

        if (collider instanceof Cherry) this.cherriesCollected += 1;
        if (collider instanceof Gem) this.gemsCollected += 1;

        if (collider instanceof Enemy) {
            if (collider instanceof Minion) this.TakeDamage(.5);
            if (collider instanceof Boss) this.TakeDamage(1);
        }
    }

    /**
     * Wird jeden Frame aufgerufen.
     * Verarbeitet Eingaben, Physik, Zustand, Animation und Rendering.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    OnTick(deltaTime) {
        super.OnTick(deltaTime);
        this.moveAmount = 0;
        if (this.positionY >= Level.GROUND) this.isGrounded = true;
        if (this.state != this.PlayerState.DEAD && this.state != this.PlayerState.VICTORY) {
            this.MoveRight(deltaTime);
            this.MoveLeft(deltaTime);
            this.Jump(deltaTime);
            this.Shoot(deltaTime);
        }
        this.ApplyGravity(deltaTime);
        this.SetPlayerState(deltaTime);
        this.Animate(deltaTime);
        this.DrawImage();
    }

    /**
     * Bewegt den Spieler nach rechts wenn {@link InputManager.RIGHT} aktiv ist.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    MoveRight(deltaTime) {
        if (InputManager.RIGHT) {
            this.moveAmount = deltaTime * this.speed;
            this.positionX += this.moveAmount;
            this.isMovingLeft = false;
        }
    }

    /**
     * Bewegt den Spieler nach links wenn {@link InputManager.LEFT} aktiv ist.
     * Verhindert dass der Spieler den linken Weltrand verlässt.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    MoveLeft(deltaTime) {
        if (InputManager.LEFT) {
            this.moveAmount = deltaTime * this.speed;
            this.positionX -= this.moveAmount;
            if (this.positionX < 0) this.positionX = 0;
            this.isMovingLeft = true;
        }
    }

    /**
     * Lässt den Spieler springen wenn er am Boden ist und {@link InputManager.JUMP} aktiv ist.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Jump(deltaTime) {
        if (this.isGrounded && InputManager.JUMP) {
            this.velocityY = this.jumpSpeed;
            this.isGrounded = false;
            AudioManager.Play(AudioAssets.JUMP, false);
        }
    }

    /**
     * Wendet Schwerkraft auf den Spieler an solange er nicht am Boden ist.
     * Begrenzt die Position auf den Boden des Levels.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    ApplyGravity(deltaTime) {
        if (!this.isGrounded) {
            this.velocityY -= deltaTime * this.gravity;
            this.positionY -= this.velocityY;
            if (this.positionY > Level.GROUND) this.positionY = Level.GROUND;
        }
    }

    /**
     * Feuert ein Projektil aus dem {@link Player#projectilePool} wenn {@link InputManager.SHOOT}
     * aktiv ist und kein Cooldown läuft.
     * Verwaltet den Schuss-Cooldown.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Shoot(deltaTime) {
        if (InputManager.SHOOT) {
            if (!this.isShootOnCooldown) {
                this.projectilePool.some(projectile => {
                    if (!projectile.isBeingShot) {
                        projectile.Shoot((this.positionX + (this.isMovingLeft ? -15 : 25)), this.positionY + 25, this.isMovingLeft ? -1 : 1);
                        return true;
                    } else {
                        return false;
                    }
                });
                this.isShootOnCooldown = true;
            }
        }
        if (this.isShootOnCooldown) {
            this.currentCooldownTime += deltaTime;
            if (this.currentCooldownTime >= this.shootCooldown) {
                this.currentCooldownTime = 0;
                this.isShootOnCooldown = false;
            }
        }
    }

    /**
     * Bestimmt den aktuellen {@link Player#PlayerState} basierend auf Eingaben,
     * Bodenkontakt und Idle-Zeit.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    SetPlayerState(deltaTime) {
        if (this.state == this.PlayerState.VICTORY) return;

        if (this.isGrounded) {
            if (InputManager.LEFT || InputManager.RIGHT) {
                this.state = this.PlayerState.RUN;
            } else {
                this.idleTime += deltaTime;
                if (this.idleTime < this.longIdleTime) {
                    this.state = this.PlayerState.IDLE;
                } else {
                    this.state = this.PlayerState.LONG_IDLE;
                }
            }
        } else {
            this.state = this.PlayerState.JUMP;
        }
        if (this.isDead) this.state = this.PlayerState.DEAD;
        if (this.state != this.PlayerState.IDLE && this.state != this.PlayerState.LONG_IDLE) this.idleTime = 0;
    }

    /**
     * Setzt den passenden Animations-Frame basierend auf dem aktuellen Zustand.
     * Beim Springen wird zwischen Aufwärts- und Abwärtsbewegung unterschieden.
     * @param {number} deltaTime - Zeit in Sekunden seit dem letzten Frame.
     */
    Animate(deltaTime) {
        super.Animate(deltaTime);
        switch (this.state) {
            case this.PlayerState.IDLE:
                this.SetAnimationFrame(this.idle.nextFrame(deltaTime));
                break;
            case this.PlayerState.LONG_IDLE:
                this.SetAnimationFrame(this.longIdle.nextFrame(deltaTime));
                break;
            case this.PlayerState.RUN:
                this.SetAnimationFrame(this.run.nextFrame(deltaTime));
                break;
            case this.PlayerState.JUMP:
                this.SetAnimationFrame(this.velocityY > 0 ? this.jumpImg1 : this.jumpImg2);
                break;
            case this.PlayerState.DEAD:
                this.SetAnimationFrame(this.playerDeadImg);
                break;
            case this.PlayerState.VICTORY:
                this.SetAnimationFrame(this.playerVictoryImg);
                break;
            default:
                this.SetAnimationFrame(this.idle.nextFrame(deltaTime));
                break;
        }
    }

    /**
     * Zeichnet den Spieler auf den Canvas.
     * Spiegelt das Sprite horizontal wenn der Spieler sich nach links bewegt.
     */
    DrawImage() {
        if (this.isMovingLeft) {
            this.context.save();
            this.context.translate(this.sizeX, 0);
            this.context.scale(-1, 1);
            this.positionX *= -1;
        }

        this.context.drawImage(this.img, this.positionX, this.positionY, this.sizeX, this.sizeY);

        if (this.isMovingLeft) {
            this.positionX *= -1;
            this.context.restore();
        }
    }

    /**
     * Versetzt den Spieler in den Victory-Zustand.
     * Wird von {@link Goal} aufgerufen wenn der Spieler das Ziel erreicht.
     */
    Victory() {
        this.state = this.PlayerState.VICTORY;
    }

    /**
     * Initialisiert alle {@link Animation} Instanzen für Hurt, Idle, Long-Idle und Run.
     */
    CreateAnimations() {
        this.hurt = new Animation([
            SpriteAssets.PLAYER.HURT_1,
            SpriteAssets.PLAYER.HURT_2
        ]);

        this.idle = new Animation([
            SpriteAssets.PLAYER.IDLE_1,
            SpriteAssets.PLAYER.IDLE_2,
            SpriteAssets.PLAYER.IDLE_3,
            SpriteAssets.PLAYER.IDLE_4,
        ]);

        this.longIdle = new Animation([
            SpriteAssets.PLAYER.LONG_IDLE_1,
            SpriteAssets.PLAYER.LONG_IDLE_2
        ]);

        this.run = new Animation([
            SpriteAssets.PLAYER.RUN_1,
            SpriteAssets.PLAYER.RUN_2,
            SpriteAssets.PLAYER.RUN_3,
            SpriteAssets.PLAYER.RUN_4,
            SpriteAssets.PLAYER.RUN_5,
            SpriteAssets.PLAYER.RUN_6
        ]);
    }
}
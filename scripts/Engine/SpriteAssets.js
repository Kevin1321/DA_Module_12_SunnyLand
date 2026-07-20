/**
 * @fileoverview Enthält alle Sprite-Asset-Pfade des Spiels als statische Eigenschaften.
 * @module SpriteAssets
 */

/**
 * Zentrale Sammlung aller Sprite-Asset-Pfade, gruppiert nach Kategorie.
 * Alle Pfade sind relative Strings die direkt als `src` für {@link HTMLImageElement} verwendet werden.
 */
class SpriteAssets {

    /**
     * Sprites für den Spieler (Foxy).
     * @static
     * @type {{ DEAD: string, HURT_1: string, HURT_2: string, IDLE_1: string, IDLE_2: string, IDLE_3: string, IDLE_4: string, LONG_IDLE_1: string, LONG_IDLE_2: string, JUMP_1: string, JUMP_2: string, RUN_1: string, RUN_2: string, RUN_3: string, RUN_4: string, RUN_5: string, RUN_6: string, VICTORY: string }}
     */
    static PLAYER = {
        DEAD: "assets/sprites/characters/Foxy/Hurt2/hurt-2.png",
        HURT_1: "assets/sprites/characters/Foxy/hurt/player-hurt-1.png",
        HURT_2: "assets/sprites/characters/Foxy/hurt/player-hurt-2.png",
        IDLE_1: "assets/sprites/characters/Foxy/idle/player-idle-1.png",
        IDLE_2: "assets/sprites/characters/Foxy/idle/player-idle-2.png",
        IDLE_3: "assets/sprites/characters/Foxy/idle/player-idle-3.png",
        IDLE_4: "assets/sprites/characters/Foxy/idle/player-idle-4.png",
        LONG_IDLE_1: "assets/sprites/characters/Foxy/crouch/player-crouch-1.png",
        LONG_IDLE_2: "assets/sprites/characters/Foxy/crouch/player-crouch-2.png",
        JUMP_1: "assets/sprites/characters/Foxy/jump/player-jump-1.png",
        JUMP_2: "assets/sprites/characters/Foxy/jump/player-jump-2.png",
        RUN_1: "assets/sprites/characters/Foxy/run/player-run-1.png",
        RUN_2: "assets/sprites/characters/Foxy/run/player-run-2.png",
        RUN_3: "assets/sprites/characters/Foxy/run/player-run-3.png",
        RUN_4: "assets/sprites/characters/Foxy/run/player-run-4.png",
        RUN_5: "assets/sprites/characters/Foxy/run/player-run-5.png",
        RUN_6: "assets/sprites/characters/Foxy/run/player-run-6.png",
        VICTORY: "assets/sprites/characters/Foxy/Victory/Victory.png"
    }

    /**
     * Sprites für den Slimer-Gegner (Minion).
     * @static
     * @type {{ IDLE_1: string, IDLE_2: string, IDLE_3: string, IDLE_4: string, IDLE_5: string, IDLE_6: string, IDLE_7: string, IDLE_8: string, MOVE_1: string, MOVE_2: string, MOVE_3: string, MOVE_4: string, MOVE_5: string, MOVE_6: string, MOVE_7: string }}
     */
    static SLIMER = {
        IDLE_1: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle1.png",
        IDLE_2: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle2.png",
        IDLE_3: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle3.png",
        IDLE_4: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle4.png",
        IDLE_5: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle5.png",
        IDLE_6: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle6.png",
        IDLE_7: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle7.png",
        IDLE_8: "assets/sprites/characters/Slimer/Slimer-Idle/slimer-idle8.png",
        MOVE_1: "assets/sprites/characters/Slimer/Slimer-move/slimer1.png",
        MOVE_2: "assets/sprites/characters/Slimer/Slimer-move/slimer2.png",
        MOVE_3: "assets/sprites/characters/Slimer/Slimer-move/slimer3.png",
        MOVE_4: "assets/sprites/characters/Slimer/Slimer-move/slimer4.png",
        MOVE_5: "assets/sprites/characters/Slimer/Slimer-move/slimer5.png",
        MOVE_6: "assets/sprites/characters/Slimer/Slimer-move/slimer6.png",
        MOVE_7: "assets/sprites/characters/Slimer/Slimer-move/slimer7.png"
    }

    /**
     * Sprites für den Vulture-Boss.
     * @static
     * @type {{ IDLE_1: string, IDLE_2: string, IDLE_3: string, IDLE_4: string, FLYING_1: string, FLYING_2: string, FLYING_3: string, FLYING_4: string }}
     */
    static VULTURE = {
        IDLE_1: "assets/sprites/characters/Vulture/Vulture-Idle/vulture-idle1.png",
        IDLE_2: "assets/sprites/characters/Vulture/Vulture-Idle/vulture-idle2.png",
        IDLE_3: "assets/sprites/characters/Vulture/Vulture-Idle/vulture-idle3.png",
        IDLE_4: "assets/sprites/characters/Vulture/Vulture-Idle/vulture-idle4.png",
        FLYING_1: "assets/sprites/characters/Vulture/Vulture-Flying/vulture1.png",
        FLYING_2: "assets/sprites/characters/Vulture/Vulture-Flying/vulture2.png",
        FLYING_3: "assets/sprites/characters/Vulture/Vulture-Flying/vulture3.png",
        FLYING_4: "assets/sprites/characters/Vulture/Vulture-Flying/vulture4.png"
    }

    /**
     * Hintergrund-Sprites für die verschiedenen Welten.
     * @static
     * @type {{ SUNNY_LAND_BASE: string, SUNNY_LAND_FOREST: string }}
     */
    static BACKGROUNDS = {
        SUNNY_LAND_BASE: "assets/sprites/environments/Backgrounds/SunnyLandBase/back.png",
        SUNNY_LAND_FOREST: "assets/sprites/environments/Backgrounds/SunnyLandForest/background.png"
    }

    /**
     * Mittelgrund-Sprites für Parallax-Effekte.
     * @static
     * @type {{ SUNNY_LAND_BASE: string, SUNNY_LAND_FOREST: string }}
     */
    static MIDDLEGROUNDS = {
        SUNNY_LAND_BASE: "assets/sprites/environments/Backgrounds/SunnyLandBase/middle.png",
        SUNNY_LAND_FOREST: "assets/sprites/environments/Backgrounds/SunnyLandForest/middleground.png"
    }

    /**
     * Sprites für die Level-Tiles (Boden und Gras).
     * @static
     * @type {{ LEVEL_1: string, LEVEL_1_GRASS: string }}
     */
    static LEVEL = {
        LEVEL_1: "assets/sprites/environments/Level/Level_1.png",
        LEVEL_1_GRASS: "assets/sprites/environments/Level/Level_1_grass.png"
    }

    /**
     * Sprites für dekorative und interaktive Props in der Spielwelt.
     * @static
     * @type {{ BIG_CRATE: string, BLOCK_BIG: string, BLOCK: string, BUSH: string, CRATE: string, ROCK: string, ROCK_1: string, ROCK_2: string, SHROOMS: string, SIGN: string, TREE: string, WOODEN_HOUSE: string }}
     */
    static PROPS = {
        BIG_CRATE: "assets/sprites/environments/Props/big-crate.png",
        BLOCK_BIG: "assets/sprites/environments/Props/block-big.png",
        BLOCK: "assets/sprites/environments/Props/block.png",
        BUSH: "assets/sprites/environments/Props/bush.png",
        CRATE: "assets/sprites/environments/Props/crate.png",
        ROCK: "assets/sprites/environments/Props/rock.png",
        ROCK_1: "assets/sprites/environments/Props/rock-1.png",
        ROCK_2: "assets/sprites/environments/Props/rock-2.png",
        SHROOMS: "assets/sprites/environments/Props/shrooms.png",
        SIGN: "assets/sprites/environments/Props/sign.png",
        TREE: "assets/sprites/environments/Props/palm.png",
        WOODEN_HOUSE: "assets/sprites/environments/Props/wooden-house.png"
    }

    /**
     * Sprites für Projektile des Spielers.
     * @static
     * @type {{ STAR: string }}
     */
    static PROJECTILS = {
        STAR: "assets/sprites/Projectiles/star.png"
    }

    /**
     * Sprites für einsammelbare Objekte (Kirschen und Edelsteine).
     * @static
     * @type {{ CHERRY_1: string, CHERRY_2: string, CHERRY_3: string, CHERRY_4: string, CHERRY_5: string, CHERRY_6: string, CHERRY_7: string, GEM_1: string, GEM_2: string, GEM_3: string, GEM_4: string, GEM_5: string }}
     */
    static PICK_UPS = {
        CHERRY_1: "assets/sprites/PickUps/cherry/cherry-1.png",
        CHERRY_2: "assets/sprites/PickUps/cherry/cherry-2.png",
        CHERRY_3: "assets/sprites/PickUps/cherry/cherry-3.png",
        CHERRY_4: "assets/sprites/PickUps/cherry/cherry-4.png",
        CHERRY_5: "assets/sprites/PickUps/cherry/cherry-5.png",
        CHERRY_6: "assets/sprites/PickUps/cherry/cherry-6.png",
        CHERRY_7: "assets/sprites/PickUps/cherry/cherry-7.png",
        GEM_1: "assets/sprites/PickUps/gem/gem-1.png",
        GEM_2: "assets/sprites/PickUps/gem/gem-2.png",
        GEM_3: "assets/sprites/PickUps/gem/gem-3.png",
        GEM_4: "assets/sprites/PickUps/gem/gem-4.png",
        GEM_5: "assets/sprites/PickUps/gem/gem-5.png",
    }

    /**
     * Sprites für visuelle Effekte (Todesanimation, Item-Feedback).
     * @static
     * @type {{ ENEMY_DEATH_1: string, ENEMY_DEATH_2: string, ENEMY_DEATH_3: string, ENEMY_DEATH_4: string, ENEMY_DEATH_5: string, ENEMY_DEATH_6: string, ITEM_FEEDBACK_1: string, ITEM_FEEDBACK_2: string, ITEM_FEEDBACK_3: string, ITEM_FEEDBACK_4: string }}
     */
    static VFX = {
        ENEMY_DEATH_1: "assets/sprites/VFX/enemy-death/enemy-death-1.png",
        ENEMY_DEATH_2: "assets/sprites/VFX/enemy-death/enemy-death-2.png",
        ENEMY_DEATH_3: "assets/sprites/VFX/enemy-death/enemy-death-3.png",
        ENEMY_DEATH_4: "assets/sprites/VFX/enemy-death/enemy-death-4.png",
        ENEMY_DEATH_5: "assets/sprites/VFX/enemy-death/enemy-death-5.png",
        ENEMY_DEATH_6: "assets/sprites/VFX/enemy-death/enemy-death-6.png",
        ITEM_FEEDBACK_1: "assets/sprites/VFX/item-feedback/item-feedback-1.png",
        ITEM_FEEDBACK_2: "assets/sprites/VFX/item-feedback/item-feedback-2.png",
        ITEM_FEEDBACK_3: "assets/sprites/VFX/item-feedback/item-feedback-3.png",
        ITEM_FEEDBACK_4: "assets/sprites/VFX/item-feedback/item-feedback-4.png"
    }

    /**
     * Sprites für UI-Elemente des Spiels.
     * @static
     * @type {{ PLAYER_HUD: { FOXY_PORTAIT: string, FRAME: string, HEART_EMPTY: string, HEART_FULL: string, HEART_HALF: string, ITEM_SLOT: string } }}
     */
    static UI = {
        PLAYER_HUD: {
            FOXY_PORTAIT: "assets/sprites/UI/foxy-portrait.png",
            FRAME: "assets/sprites/UI/frame.png",
            HEART_EMPTY: "assets/sprites/UI/heart-empty.png",
            HEART_FULL: "assets/sprites/UI/heart-full.png",
            HEART_HALF: "assets/sprites/UI/heart-half.png",
            ITEM_SLOT: "assets/sprites/UI/item-slot.png"
        }
    }
}
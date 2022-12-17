import Phaser from "phaser";

let game: Phaser.Game;

export const GAME_SIZE = {
  width: 800,
  height: 600,
};

export class Game {
  private isInitialized = false;
  private gameRef: Phaser.Game;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
    null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  private constructor(canvasRef: HTMLCanvasElement) {
    this.gameRef = new Phaser.Game({
      ...this.makeConfiguration(),
      canvas: canvasRef,
    });
  }

  static initialize(canvasRef: HTMLCanvasElement | null) {
    if (canvasRef == null) {
      return;
    }

    return new Game(canvasRef);
  }

  private makeConfiguration(): Phaser.Types.Core.GameConfig {
    const localPreload = this.preload.bind(this);
    const localCreate = this.create.bind(this);
    const localUpdate = this.update.bind(this);

    return {
      type: Phaser.CANVAS,
      ...GAME_SIZE,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload() {
          localPreload(this);
        },
        create() {
          localCreate(this);
        },
        update() {
          localUpdate(this);
        },
      },
    };
  }

  private preload(scene: Phaser.Scene) {
    scene.load.image({
      key: "sky",
      url: "/assets/sky.png",
    });
    scene.load.image({
      key: "ground",
      url: "/assets/platform.png",
    });
    scene.load.spritesheet("player", "/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  private create(scene: Phaser.Scene) {
    if (this.isInitialized) return;

    scene.add.image(400, 300, "sky");

    const platforms = this.createPhysics(scene);
    const player = this.createPlayer(scene);

    this.initializeController(scene);

    scene.physics.add.collider(player, platforms);

    this.isInitialized = true;
  }

  private update(scene: Phaser.Types.Core.GameConfig["scene"]) {
    if (this.player == null || this.cursors == null) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160).anims.play("playerMoveLeft", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160).anims.play("right", true);
    } else {
      this.player.setVelocityX(0).anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  private createPhysics(scene: Phaser.Scene) {
    if (this.platforms != null) return this.platforms;

    this.platforms = scene.physics.add.staticGroup();

    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");

    return this.platforms;
  }

  private createPlayer(scene: Phaser.Scene) {
    if (this.player != null) return this.player;

    this.player = scene.physics.add.sprite(100, 450, "player");

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    scene.anims.create({
      key: "playerMoveLeft",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
      showOnStart: true,
    });

    scene.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 20,
    });

    scene.anims.create({
      key: "right",
      frames: scene.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return this.player;
  }

  private initializeController(scene: Phaser.Scene) {
    if (this.cursors == null) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    }
  }
}

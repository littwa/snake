import Phaser from "phaser";

let snake;
let food;
let cursors;

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  ////////////////////////////////////////////////////////////////////

  gameOver() {
    this.scene.manager.stop("Game");
    this.scene.manager.start("FinishScene", { snake, food });
  }

  preload() {
    this.load.image("food", "assets/coin.png");
    this.load.image("body", "assets/player.png");
    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");

    setTimeout(() => this.gameOver(), 60000);
  }

  create() {
    let scoreBitmapText;
    scoreBitmapText = this.add.bitmapText(6, 6, "arcade", "0", 20).setTint(0xffffff);
    // let scoreText;
    // scoreText = this.add.text(6, 6, "0", { fontSize: "24px", fill: "#000" });

    let Food = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,

      initialize: function Food(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene);

        this.setTexture("food");
        this.setPosition(x * 16, y * 16).setOrigin(0, 0);

        this.total = 0;

        scene.children.add(this);
      },

      eat: function () {
        this.total++;
        scoreBitmapText.setText(this.total);

        if (this.total > 3) {
          let sceneBind = this;
          return setTimeout(() => sceneBind.scene.gameOver(), 0);
        }
      },
    });

    let Snake = new Phaser.Class({
      initialize: function Snake(scene, x, y) {
        this.headPosition = new Phaser.Geom.Point(x, y);

        this.body = scene.add.group();

        this.head = this.body.create(x * 16, y * 16, "body");
        this.head.setOrigin(0);

        this.alive = true;

        this.speed = 300;

        this.moveTime = 0;

        this.tail = new Phaser.Geom.Point(x, y);

        this.grow();
        this.grow();

        this.heading = RIGHT;
        this.direction = RIGHT;
      },

      hitBody: function () {
        return Phaser.Actions.GetFirst(
          this.body.children.entries,
          { x: this.head.x, y: this.head.y },
          1,
        );
      },

      update: function (time) {
        if (time >= this.moveTime) {
          return this.move(time);
        }
      },

      faceLeft: function () {
        if (this.direction === UP || this.direction === DOWN) {
          this.heading = LEFT;
        }
      },

      faceRight: function () {
        if (this.direction === UP || this.direction === DOWN) {
          this.heading = RIGHT;
        }
      },

      faceUp: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {
          this.heading = UP;
        }
      },

      faceDown: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {
          this.heading = DOWN;
        }
      },

      move: function (time) {
        if (this.hitBody()) {
          this.alive = false;
          return false;
        }

        switch (this.heading) {
          case LEFT:
            this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
            break;

          case RIGHT:
            this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
            break;

          case UP:
            this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
            break;

          case DOWN:
            this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
            break;
          default:
            console.log("Error");
        }

        this.direction = this.heading;

        Phaser.Actions.ShiftPosition(
          this.body.getChildren(),
          this.headPosition.x * 16,
          this.headPosition.y * 16,
          1,
          this.tail,
        );

        this.moveTime = time + this.speed;

        return true;
      },

      grow: function () {
        let newPart = this.body.create(this.tail.x, this.tail.y, "body");

        newPart.setOrigin(0);
      },

      collideWithFood: function (food) {
        if (this.head.x === food.x && this.head.y === food.y) {
          this.grow();

          food.eat();

          if (this.speed > 20 && food.total % 5 === 0) {
            this.speed -= 5;
          }

          return true;
        } else {
          return false;
        }
      },

      updateGrid: function (grid) {
        this.body.children.each(function (segment) {
          let bx = segment.x / 16;
          let by = segment.y / 16;

          grid[by][bx] = false;
        });

        return grid;
      },
    });

    snake = new Snake(this, 8, 8);
    food = new Food(this, 10, 4);

    cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    if (!snake.alive) {
      this.scene.manager.stop("Game");
      this.scene.manager.start("FinishScene", { snake, food });
      return;
    }

    if (cursors.left.isDown) {
      snake.faceLeft();
    } else if (cursors.right.isDown) {
      snake.faceRight();
    } else if (cursors.up.isDown) {
      snake.faceUp();
    } else if (cursors.down.isDown) {
      snake.faceDown();
    }

    if (snake.update(time)) {
      if (snake.collideWithFood(food)) {
        this.repositionFood();
      }
    }
  }

  repositionFood() {
    let testGrid = [];

    for (let y = 0; y < 30; y++) {
      testGrid[y] = [];

      for (let x = 0; x < 40; x++) {
        testGrid[y][x] = true;
      }
    }

    snake.updateGrid(testGrid);

    let validLocations = [];

    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 40; x++) {
        if (testGrid[y][x] === true) {
          validLocations.push({ x: x, y: y });
        }
      }
    }

    if (validLocations.length > 0) {
      let pos = Phaser.Math.RND.pick(validLocations);

      food.setPosition(pos.x * 16, pos.y * 16);

      return true;
    } else {
      return false;
    }
  }
}

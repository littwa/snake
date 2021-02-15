import Phaser from "phaser";
import axios from "axios";
const URL = "http://localhost:3004";

export default class FinishScene extends Phaser.Scene {
  constructor() {
    super("FinishScene");
  }

  init(data) {
    this.snake = data.snake;
    this.food = data.food;
  }

  preload() {
    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
  }

  create() {
    console.log(this.snake, this.food);
    let result = this.snake.alive && this.food.total > 0 ? "Well Done" : "Game Over";
    this.add.bitmapText(160, 50, "arcade", result).setTint(0xffffff);

    const highScore = this.add.bitmapText(480, 200, "arcade", "highscore", 20).setOrigin(0.5, 1);

    let resultButton = this.snake.alive && this.food.total > 0 ? "NExt level" : "Start Again";
    const startButton = this.add.bitmapText(160, 200, "arcade", resultButton, 20).setOrigin(0.5, 1);

    const saveResult = this.add.bitmapText(300, 300, "arcade", "save result", 20).setOrigin(0.5, 1);

    this.add
      .zone(
        saveResult.x - saveResult.width * saveResult.originX - 16,
        saveResult.y - saveResult.height * saveResult.originY - 16,
        saveResult.width + 32,
        saveResult.height + 32,
      )
      .setOrigin(0, 0)
      .setInteractive()
      .once("pointerup", () => {
        let current = JSON.parse(localStorage.getItem("snake"));
        current.level = this.food.total;

        delete current.id;

        axios
          .post(URL + "/add-users", current)
          .then(resp => {
            this.scene.manager.stop("FinishScene");
            this.scene.manager.start("OverScene");
          })
          .catch(err => console.log(err.message));
      });

    this.add
      .zone(
        startButton.x - startButton.width * startButton.originX - 16,
        startButton.y - startButton.height * startButton.originY - 16,
        startButton.width + 32,
        startButton.height + 32,
      )
      .setOrigin(0, 0)
      .setInteractive()
      .once("pointerup", () => {
        this.scene.manager.stop("FinishScene");
        this.scene.manager.start("Game");
      });

    this.add
      .zone(
        highScore.x - highScore.width * highScore.originX - 16,
        highScore.y - highScore.height * highScore.originY - 16,
        highScore.width + 32,
        highScore.height + 32,
      )
      .setOrigin(0, 0)
      .setInteractive()
      .once("pointerup", () => {
        this.scene.manager.stop("FinishScene");
        this.scene.manager.start("OverScene");
      });
  }
}

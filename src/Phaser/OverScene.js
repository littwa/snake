import Phaser from "phaser";
import axios from "axios";

let best = [
  { id: 12121, name: "Bob", level: 2 },
  { id: 13345, name: "Pit", level: 3 },
];

let game;
let scores = best;
export default class OverScene extends Phaser.Scene {
  constructor() {
    super("OverScene");
    this.scores = [];
  }
  preload() {
    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
  }
  create() {
    /////////////////////////////////////////////////////////////////
    axios
      .get("http://localhost:3004/get-users", {})
      .then(resp => {
        console.log(resp.data);
        scores = resp.data;
        this.add.bitmapText(50, 50, "arcade", "RANK SCORE NAME").setTint(0xffffff);
        for (let i = 1; i < 6; i++) {
          if (scores[i - 1]) {
            this.add
              .bitmapText(
                50,
                100 + 50 * i,
                "arcade",
                ` ${i}    ${scores[i - 1].level}    ${scores[i - 1].name}`,
              )
              .setTint(0xffffff);
          } else {
            this.add.bitmapText(50, 100 + 50 * i, "arcade", ` ${i}    0    ---`).setTint(0xffffff);
          }
        }
        // this.scene.manager.stop("FinishScene");
        // this.scene.manager.start("OverScene");
      })
      .catch(err => {
        console.log(err.message);
        this.add.bitmapText(50, 50, "arcade", "sever no connected ").setTint(0xffffff);
      });

    /////////////////////////////////////////////////////////////////

    // this.add.bitmapText(50, 50, "arcade", "RANK SCORE NAME").setTint(0xffffff);
    // for (let i = 1; i < 6; i++) {
    //   if (scores[i - 1]) {
    //     this.add
    //       .bitmapText(
    //         50,
    //         100 + 50 * i,
    //         "arcade",
    //         ` ${i}    ${scores[i - 1].level}    ${scores[i - 1].name}`,
    //       )
    //       .setTint(0xffffff);
    //   } else {
    //     this.add.bitmapText(50, 100 + 50 * i, "arcade", ` ${i}    0    ---`).setTint(0xffffff);
    //   }
    // }

    const startButton = this.add
      .bitmapText(280, 450, "arcade", "start again", 20)
      .setOrigin(0.5, 1);

    this.add.tween({
      targets: [startButton],
      ease: k => (k < 0.5 ? 0 : 1),
      duration: 450,
      yoyo: true,
      repeat: -1,
      alpha: 0,
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
        this.scene.manager.stop("OverScene");
        this.scene.manager.start("Game");
      });
  }
}

// let config = {
//   type: Phaser.AUTO,
//   parent: "phaser-example",
//   width: 800,
//   height: 600,
//   pixelArt: true,
//   scene: [Highscore],
// };

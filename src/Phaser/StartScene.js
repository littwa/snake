import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    this.load.html("nameform", "assets/nameform.html"); //snake
    this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
  }

  create() {
    let text = this.add.bitmapText(40, 50, "arcade", "", 20).setTint(0xffffff);
    // let text = this.add.text(130, 40, "", {
    //   color: "white",
    //   fontSize: "30px ",
    // });

    let current = JSON.parse(localStorage.getItem("snake"));

    if (current) {
      text.setText("Welcome " + current.name);
    }
    if (!current) {
      text.setText("Please enter your name");
    }

    var element = this.add.dom(300, 200).createFromCache("nameform");

    if (current) {
      element.getChildByName("nameField").setAttribute("hidden", true);
      element.getChildByName("playButton").removeAttribute("disabled");
    }

    element.addListener("click");
    element.addListener("input");

    element.on("input", function (e) {
      e.target.value.length > 1 && this.getChildByName("playButton").removeAttribute("disabled");
    });

    element.on("click", function (event) {
      if (element.getChildByName("nameField").getAttribute("hidden")) {
        this.setVisible(false);
        text.setText("");
        this.scene.scene.manager.start("Game");
        return;
      }
      if (event.target.name === "playButton") {
        var inputText = this.getChildByName("nameField");

        if (inputText.value !== "") {
          this.removeListener("click");

          this.setVisible(false);

          let objLocalStor = { name: inputText.value, level: null, id: Date.now() };
          localStorage.setItem("snake", JSON.stringify(objLocalStor));
          text.setText("");
          this.scene.scene.manager.start("Game");
        }
      }
    });
  }
}

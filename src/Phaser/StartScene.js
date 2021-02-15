import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    // this.load.bitmapFont("arcade", "assets/arcade.png", "assets/arcade.xml");
    this.load.html("nameform", "assets/nameform.html");

    // let current = JSON.parse(localStorage.getItem("snake"));
  }

  create() {
    // this.add.bitmapText(10, 50, "arcade", "RANK  SCORE   NAME").setTint(0xffffff);
    let text = this.add.text(150, 40, "", {
      color: "white",
      fontSize: "20px ",
    });

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
      console.log(element.getChildByName("nameField").getAttribute("hidden"));
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

        //  Have they entered anything?
        if (inputText.value !== "") {
          //  Turn off the click events
          this.removeListener("click");

          //  Hide the login element
          this.setVisible(false);

          //  Populate the text with whatever they typed in
          let objLocalStor = { name: inputText.value, level: null, id: Date.now() };
          localStorage.setItem("snake", JSON.stringify(objLocalStor));
          text.setText("");
          this.scene.scene.manager.start("Game");
        }
      }
    });
  }
}

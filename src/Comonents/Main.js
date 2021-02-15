import React from "react";
import Phaser from "phaser";
import StartScene from "../Phaser/StartScene";
import GameScene from "../Phaser/GameScene";
import FinishScene from "../Phaser/FinishScene";
import OverScene from "../Phaser/OverScene";

class Test extends React.Component {
  componentDidMount() {
    let config = {
      type: Phaser.WEBGL,
      width: 640,
      height: 480,
      backgroundColor: "#000",
      dom: {
        createContainer: true,
      },
      parent: "phaser-example",
      scene: [StartScene, FinishScene, GameScene, OverScene],
    };

    new Phaser.Game(config);
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div id="phaser-game"></div>;
  }
}

export default Test;

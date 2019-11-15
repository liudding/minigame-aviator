const THREE = require("three");
import { Colors } from "../params";
import Text2D from '../base/text.js'

export default class GameInfo {
  constructor() {
    let distanceLabel = new Text2D("Distance", {
      font: "20px Arial"
    });
    distanceLabel.position.set(-50, 0, 1);
    this.distanceLabel = distanceLabel;


    let energyLabel = new Text2D("Energy", {
      font: "10px Arial"
    });
    energyLabel.position.set(50, 0, 1);
    this.energyLabel = energyLabel;

    this.group = new THREE.Group();
    this.group.add(this.distanceLabel)
    this.group.add(this.energyLabel)

    this.mesh = this.group
  }

  updateInfos(distance, energy) {
    this.distanceLabel.text = distance
    this.energyLabel.text = energy
  }

  updateDistance(distance) {
    this.distanceLabel.text = distance
  }

  updateEnergy(energy) {
    this.energyLabel.text = energy
  }
}

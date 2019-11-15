const THREE = require("three");
import DataBus from "../databus";

const databus = new DataBus();

import { Colors } from "../params";

import TweenMax from "../libs/TweenMax";

import Power2 from "../libs/TweenMax";

export default class Coin {
  constructor(energy=0) {
    var geom = new THREE.TetrahedronGeometry(5, 0);
    var mat = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff,

      flatShading: true
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;

    this.angle = 0;
    this.dist = 0;

    this.energy = energy
  }

 
}

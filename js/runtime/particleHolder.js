const THREE = require("three");
import DataBus from "../databus";
import Particle from './particle'

const databus = new DataBus();

import { Colors } from "../params";

export default class ParticleHolder {
  constructor() {
    this.mesh = new THREE.Object3D();
  }

  createParticle() {
    let particle = databus.pool.getItemByClass("particle", Particle);

    return particle;
  }

  spawnParticles(pos, density, color, scale) {
    var nPArticles = density;
    for (var i = 0; i < nPArticles; i++) {
      var particle = this.createParticle()
      
      this.mesh.add(particle.mesh);
      particle.mesh.visible = true;
      var _this = this;
      particle.mesh.position.y = pos.y;
      particle.mesh.position.x = pos.x;
      particle.explode(pos, color, scale);
    }
  }
}

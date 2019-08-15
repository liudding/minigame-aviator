const THREE = require("three");
import DataBus from "../databus";

const databus = new DataBus();

import { Colors } from "../params";

import TweenMax from '../libs/TweenMax'

import Power2 from '../libs/TweenMax'

export default class Particle {
  constructor(ctx) {
    var geom = new THREE.TetrahedronGeometry(3, 0);
    var mat = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff,
      flatShading: true
    });
    this.mesh = new THREE.Mesh(geom, mat);
  }

  explode(pos, color, scale) {
    var _this = this;
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    var targetX = pos.x + (-1 + Math.random() * 2) * 50;
    var targetY = pos.y + (-1 + Math.random() * 2) * 50;
    var speed = 0.6 + Math.random() * 0.2;
    TweenMax.to(this.mesh.rotation, speed, {
      x: Math.random() * 12,
      y: Math.random() * 12
    });
    TweenMax.to(this.mesh.scale, speed, { x: 0.1, y: 0.1, z: 0.1 });
    TweenMax.to(this.mesh.position, speed, {
      x: targetX,
      y: targetY,
      delay: Math.random() * 0.1,
      ease: Power2.easeOut,
      onComplete: function() {
        if (_p) _p.remove(_this.mesh);
        _this.mesh.scale.set(1, 1, 1);
        databus.removeParticle(_this)
      }
    });
  }
}

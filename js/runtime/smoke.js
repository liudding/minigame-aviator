const THREE = require("three");

import DataBus from "../databus";
const databus = new DataBus();

export default class Smoke {
  constructor() {
    this.mesh = new THREE.Group();

    var material = new THREE.MeshLambertMaterial({
      color: 0x222222
    });

    this.puffs = [0, 10, 15, 20, 25, 30, 35, ];

    for (var i = 0; i < this.puffs.length; i++) {
      this.mesh.add(
        new THREE.Mesh(new THREE.IcosahedronGeometry(10, 0), material)
      );
    }

    this.mesh.children.forEach(item => {
      item.geometry.computeFlatVertexNormals();
      item.position.setX(Math.random() * 10);
      item.position.setZ(Math.random() * 10);
      item.rotation.x = Math.random();
      item.rotation.y = Math.random();
      item.rotation.z = Math.random();
    });
  }

  puff(sprite) {
    let smoke = this.mesh;
    let puffs = this.puffs;

    this.mesh.position.set(sprite.mesh.position.x, sprite.mesh.position.y, sprite.mesh.position.z);

    this.mesh.rotation.z -=
      (-Math.PI / 2 - this.mesh.rotation.z) *
      0.0002 *
      databus.game.frameDeltaTime;

    // this.mesh.children.forEach(item => {
    //   item.geometry.computeFlatVertexNormals();
    //   item.position.setX(Math.random() * 10);
    //   item.position.setZ(Math.random() * 10);
    // });
    
    for (var i = 0; i < this.puffs.length; i++) {
      if (puffs[i] >= 50) puffs[i] = 1;
      else puffs[i]++;

      smoke.children[i].position.setY(puffs[i]);
      smoke.children[i].scale.setScalar(Math.sin((puffs[i] / 100.0) * Math.PI));
      smoke.children[i].rotateX(Math.sin(puffs[i] / 2500.0));
      smoke.children[i].rotateY(Math.sin(puffs[i] / 2500.0));
      smoke.children[i].rotateZ(Math.sin(puffs[i] / 2500.0));
    }
  }
}

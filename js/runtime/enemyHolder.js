const THREE = require("three");
import DataBus from "../databus";
import Enemy from "./enemy";
const databus = new DataBus();

import { Colors } from "../params";

export default class EnemyHolder {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.enemiesInUse = [];
  }

  createEnemy() {
    let enemy = databus.pool.getItemByClass("enemy", Enemy);
    databus.enemies.push(enemy);
    return enemy;
  }

  removeEnemy(enemy) {
    databus.removeEnemy(enemy);

    let i = this.enemiesInUse.findIndex(item => item === enemy);
    this.enemiesInUse.splice(i, 1);

    this.mesh.remove(enemy.mesh);
  }

  spawnEnemies(gameLevel) {
    var nEnemies = gameLevel;

    let game = databus.game

    for (var i = 0; i < nEnemies; i++) {
      var enemy = this.createEnemy();

      enemy.angle = -(i * 0.1);
      enemy.distance =
        game.sea.radius +
        game.planeDefaultHeight +
        (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
      enemy.mesh.position.y =
        - game.sea.radius + Math.sin(enemy.angle) * enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;

      this.mesh.add(enemy.mesh);
      this.enemiesInUse.push(enemy);
    }
  }

  rotateEnemies(airplane, particleHolder) {
    let game = databus.game

    this.enemiesInUse.forEach((enemy, i) => {
      enemy.angle += 0.0035//game.speed * game.frameDeltaTime * game.enemySpeed;

      // console.log(enemy.angle, 'angle', game.speed , game.frameDeltaTime , game.enemySpeed)

      if (enemy.angle > Math.PI * 2) enemy.angle -= Math.PI * 2;

      enemy.mesh.position.y =
        -game.sea.radius + Math.sin(enemy.angle) * enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;
      enemy.mesh.rotation.z += Math.random() * 0.1;
      enemy.mesh.rotation.y += Math.random() * 0.1;

      //var globalEnemyPosition =  enemy.mesh.localToWorld(new THREE.Vector3());
      var diffPos = airplane.mesh.position
        .clone()
        .sub(enemy.mesh.position.clone());

      var d = diffPos.length();

      if (d < game.enemyDistanceTolerance) {
        particleHolder.spawnParticles(
          enemy.mesh.position.clone(),
          15,
          Colors.red,
          3
        );

        databus.game.status = "gameover";

        this.removeEnemy(enemy);

        game.planeCollisionSpeedX = (100 * diffPos.x) / d;
        game.planeCollisionSpeedY = (100 * diffPos.y) / d;
        // ambientLight.intensity = 2;

        // removeEnergy();
      } else if (enemy.angle > Math.PI) {
        this.removeEnemy(enemy);
      }
    });
  }
}

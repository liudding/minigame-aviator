const THREE = require("three");
import DataBus from "../databus";
import Coin from "./coin";

const databus = new DataBus();

import { Colors } from "../params";

export default class CoinHolder {
  constructor(nCoins) {
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];

    for (var i = 0; i < nCoins; i++) {
      this.createCoin();
    }
  }

  createCoin() {
    let coin = databus.pool.getItemByClass("coin", Coin);
    coin.energy = databus.game.coinValue
    return coin
  }

  removeCoin(coin) {
    databus.removeCoin(coin);

    let i = this.coinsInUse.findIndex(item => item === coin);
    this.coinsInUse.splice(i, 1);

    this.mesh.remove(coin.mesh);
  }

  spawnCoins() {
    let game = databus.game;

    var nCoins = 1 + Math.floor(Math.random() * 10);
    var d =
      databus.game.sea.radius +
      databus.game.planeDefaultHeight +
      (-1 + Math.random() * 2) * (databus.game.planeAmpHeight - 20);

    var amplitude = 10 + Math.round(Math.random() * 10);

    for (var i = 0; i < nCoins; i++) {
      var coin = this.createCoin();

      coin.angle = -(i * 0.02);
      coin.distance = d + Math.cos(i * 0.5) * amplitude;
      coin.mesh.position.y =
        -databus.game.sea.radius + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;

      coin.mesh.position.y =
        -databus.game.sea.radius + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;

      // console.log(coin.mesh.position);

      this.mesh.add(coin.mesh);
      this.coinsInUse.push(coin);
    }
  }

  rotateCoins(airplane, particlesHolder) {
    for (let coin of this.coinsInUse) {
      if (coin.exploding) continue;

      // coin.angle +=
      //   databus.game.speed *
      //   databus.game.frameDeltaTime *
      //   databus.game.coinsSpeed;
      coin.angle += .0035;

      if (coin.angle > Math.PI * 2) {
        coin.angle -= Math.PI * 2;
      }

      coin.mesh.position.y =
        -databus.game.sea.radius + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;

      // console.log(coin.mesh.position)

      coin.mesh.rotation.z += Math.random() * 0.1;
      coin.mesh.rotation.y += Math.random() * 0.1;

      var diffPos = airplane.mesh.position
        .clone()
        .sub(coin.mesh.position.clone());
      var d = diffPos.length();

      // console.log(coin.angle )

      if (d < databus.game.coinDistanceTolerance) {
        particlesHolder.spawnParticles(
          coin.mesh.position.clone(),
          5,
          0x009999,
          0.8
        );

        this.removeCoin(coin);

        databus.addEnergy(coin.energy);
      } else if (coin.angle > Math.PI) {
        this.removeCoin(coin);
      }
    }
  }
}

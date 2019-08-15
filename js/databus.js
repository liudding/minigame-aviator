import Pool from "./base/pool";

let instance;

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance;

    instance = this;

    this.pool = new Pool();

    this.reset();
  }

  reset() {
    this.frame = 0;

    this.game = {
      frameDeltaTime: 0,
      frameNewTime: new Date().getTime(),
      frameOldTime: new Date().getTime(),

      status: "playing", // over, playing
      level: 1,
      score: 0,

      speed: 0,
      initSpeed: 0.00035,
      baseSpeed: 0.00035,

      planeDefaultHeight: 100,
      planeAmpHeight: 80,
      planeFallSpeed:.001,

      plane: {
        speed: 0.1,
        minSpeed: 1.2,
        maxSeed: 1.6
      },

      sea: {
        radius: 600,
        length: 800
      },

      enemySpeed: 0.6,
      enemyDistanceTolerance: 10,
      enemyValue: 10,
      enemiesSpeed: 0.6,
      enemyLastSpawn: 0,
      distanceForEnemiesSpawn: 50
    };

    this.score = 0;
    this.bullets = [];
    this.enemies = [];
    this.animations = [];
    this.gameOver = false;
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemy(enemy) {
    let temp = this.enemies.shift();

    this.pool.recover("enemy", enemy);
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift();

    this.pool.recover("bullet", bullet);
  }

  removeParticle(particle) {
    this.pool.recover("particle", particle);
  }
}

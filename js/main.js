import Music from "./runtime/music";
import DataBus from "./databus";
import Sea from "./runtime/sea";
import Sky from "./runtime/sky";
import AirPlane from "./runtime/airplane";
import Enemy from "./runtime/enemy";
import EnemyHolder from "./runtime/enemyHolder";
import Particle from "./runtime/particle";
import ParticleHolder from "./runtime/particleHolder";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const DevicePixelRatio = window.devicePixelRatio;

import { Colors } from "./params";

let ctx = canvas.getContext("webgl");
let databus = new DataBus();
let game = databus.game;

// import Three from 'three'
const THREE = require("three");

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0;

    this.raycaster = new THREE.Raycaster();

    this.touch = new THREE.Vector3();
    this.touchPos = {
      x: 0,
      y: 0
    };

    this.createScene();

    this.createLights();

    this.createSea();

    this.createSky();

    this.createPlane();

    this.createEnemies();

    this.createParticles();

    this.restart();
  }

  createScene() {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    // Create the scene
    let scene = new THREE.Scene();
    this.scene = scene;

    scene.background = new THREE.Color(0xf7d9aa);

    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    // Create the camera
    let aspectRatio = WIDTH / HEIGHT;
    let fieldOfView = 60;
    let nearPlane = 1;
    let farPlane = 10000;
    let camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    this.camera = camera;

    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      // alpha: true,

      // Activate the anti-aliasing; this is less performant,
      // but, as our project is low-poly based, it should be fine :)
      antialias: true
    });

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    this.renderer.setSize(WIDTH * DevicePixelRatio, HEIGHT * DevicePixelRatio);
    // renderer.setPixelRatio(window.devicePixelRatio);

    // Enable shadow rendering
    this.renderer.shadowMap.enabled = true;
  }

  createLights() {
    // A hemisphere light is a gradient colored light;
    // the first parameter is the sky color, the second parameter is the ground color,
    // the third parameter is the intensity of the light
    let hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    let shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // Set the direction of the light
    shadowLight.position.set(150, 350, 350);

    // Allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, just add them to the scene
    this.scene.add(hemisphereLight);
    this.scene.add(shadowLight);

    let ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
    this.scene.add(ambientLight);
  }

  createSea() {
    let sea = new Sea();
    // push it a little bit at the bottom of the scene
    sea.mesh.position.y = -WIDTH;

    // add the mesh of the sea to the scene
    this.scene.add(sea.mesh);

    this.sea = sea;
  }

  createSky() {
    let sky = (this.sky = new Sky());
    sky.mesh.position.y = -600;
    this.scene.add(sky.mesh);
  }

  createPlane() {
    let airplane = (this.airplane = new AirPlane());
    airplane.mesh.scale.set(0.25, 0.25, 0.25);
    airplane.mesh.position.y = 100;
    airplane.mesh.position.x = -30;
    this.scene.add(airplane.mesh);
  }

  createEnemies() {
    databus.pool.prepare("enemy", Enemy, 10);

    this.enemyHolder = new EnemyHolder();

    this.scene.add(this.enemyHolder.mesh);
  }

  createParticles() {
    databus.pool.prepare("particle", Particle, 10);

    this.particleHolder = new ParticleHolder();
    //ennemiesHolder.mesh.position.y = -game.seaRadius;
    this.scene.add(this.particleHolder.mesh);
  }

  restart() {
    databus.reset();

    this.initEvent();

    this.bindLoop = this.loop.bind(this);

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }

  normalizeTouchPos(e) {
    let x = -1 + (e.touches[0].clientX / WIDTH) * 2;
    let y = 1 - (e.touches[0].clientY / HEIGHT) * 2;
    return {
      x,
      y
    };
  }

  initEvent() {
    canvas.addEventListener(
      "touchstart",
      (e => {
        e.preventDefault();

        var intersects = this.raycaster.intersectObjects(
          this.airplane.mesh.children,
          false
        );
        if (intersects.length > 0) {
          this.airplane.touched = true;
        }

        this.touchPos = this.normalizeTouchPos(e);

        this.touch.x = this.touchPos.x;
        this.touch.y = this.touchPos.y;
        this.touch.z = 1;
      }).bind(this)
    );

    canvas.addEventListener(
      "touchmove",
      (e => {
        e.preventDefault();

        this.touchPos = this.normalizeTouchPos(e);
      }).bind(this)
    );

    canvas.addEventListener(
      "touchend",
      (e => {
        e.preventDefault();

        this.airplane.touched = false;

        if (databus.game.status === 'waitingReplay') {
          this.restart();
        }
      }).bind(this)
    );
  }

  updatePlane() {
    var targetX = this.normalize(this.touchPos.x, -1, 1, -40, 40);
    var targetY = this.normalize(this.touchPos.y, -1, 1, 50, 175);

    let airplane = this.airplane;

    // Move the plane at each frame by adding a fraction of the remaining distance
    airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1;

    // Rotate the plane proportionally to the remaining distance
    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0128;
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * 0.0064;

    this.airplane.fly()
  }

  normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin); // -1 1
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + pc * dt;
    return tv;
  }

  updateCameraFov() {
    this.camera.fov = this.normalize(this.touchPos.x, -1, 1, 40, 80);
    this.camera.updateProjectionMatrix();
  }

  // 实现游戏帧循环
  loop() {
    databus.game.frameNewTime = new Date().getTime();

    databus.game.frameDeltaTime =
      databus.game.frameNewTime - databus.game.frameOldTime;
    databus.game.frameOldTime = databus.game.frameNewTime;

    this.raycaster.setFromCamera(this.touch, this.camera);

    

    if (databus.game.status === "playing") {
      this.updatePlane();

      if (databus.game.frameNewTime % 1000 < 30) {
        this.enemyHolder.spawnEnemies(1);
      }

      
    } else if (databus.game.status === "gameover") {
      this.airplane.fall();

      if (this.airplane.mesh.position.y <-200){
        // showReplay();
        databus.game.status = "waitingReplay";
  
      }
    } else if (databus.game.status === "waitingReplay") {

    }

    // if (this.airplane.touched) {
    this.updateCameraFov();
    // }

    databus.game.speed = game.baseSpeed * game.plane.speed;

    // console.log(databus.game.speed)


    this.sky.moveClouds();
    this.sea.moveWaves();

    this.enemyHolder.rotateEnemies(this.airplane, this.particleHolder);

    this.renderer.render(this.scene, this.camera);

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }
}

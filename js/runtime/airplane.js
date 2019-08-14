const THREE = require('three')
import Pilot from './pilot'
import { Colors } from '../params'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight


export default class AirPlane  {
  constructor(ctx) {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'airplane'

    // Create the cabin
    var geomCockpit = new THREE.BoxGeometry(80, 50, 50, 2, 1, 1);
    var matCockpit = new THREE.MeshPhongMaterial({ color: Colors.red, flatShading: true });
    geomCockpit.vertices[8].x += 30;
    geomCockpit.vertices[9].x += 30;
    geomCockpit.vertices[10].x += 30;
    geomCockpit.vertices[11].x += 30;

    geomCockpit.vertices[4].y -= 10;
    geomCockpit.vertices[4].z += 20;
    geomCockpit.vertices[5].y -= 10;
    geomCockpit.vertices[5].z -= 20;
    geomCockpit.vertices[6].y += 30;
    geomCockpit.vertices[6].z += 20;
    geomCockpit.vertices[7].y += 30;
    geomCockpit.vertices[7].z -= 20;

    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.cockpit = cockpit
    this.mesh.add(cockpit);

    // Create the engine
    var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    var matEngine = new THREE.MeshPhongMaterial({ color: Colors.white, flatShading: true });
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 50;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Create the tail
    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({ color: Colors.red, flatShading: true });
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Create the wing
    var geomSideWing = new THREE.BoxGeometry(40, 6, 150, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({ color: Colors.red, flatShading: true });
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // propeller
    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matPropeller = new THREE.MeshPhongMaterial({ color: Colors.brown, flatShading: true });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // blades
    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({ color: Colors.brownDark, flatShading: true });

    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(60, 0, 0);
    this.mesh.add(this.propeller);


    let geomGlass = new THREE.BoxGeometry(3, 20, 30, 1, 1, 1)
    var matGlass = new THREE.MeshPhongMaterial({
      color: Colors.white,
      transparent: true,
      opacity: .3,
      flatShading: THREE.FlatShading,
    });
    var glass = new THREE.Mesh(geomGlass, matGlass);
    glass.position.set(20, 30, 0)
    glass.castShadow = true;
    glass.receiveShadow = true;
    this.mesh.add(glass)

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10, 27, 0);
    this.mesh.add(this.pilot.mesh);


    this.touched = false

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    // this.initEvent()
  }


}

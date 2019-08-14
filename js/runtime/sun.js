
const THREE = require('three')
import Cloud from './cloud'
import { Colors } from '../params'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight


const BG_WIDTH = 512
const BG_HEIGHT = 512

export default class Sun {
  constructor(ctx) {

    let geo = new THREE.CircleGeometry(10, 25);

    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geo, material);
  }


}

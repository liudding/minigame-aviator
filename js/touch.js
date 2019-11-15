const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const DevicePixelRatio = window.devicePixelRatio;


export default class TouchControl {
  constructor(canvas, touchstart, touchmove, touchend) {
    this.canvas = canvas;

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the object orbits around
    // this.target = new THREE.Vector3();

    this.startPos = {}
    this.touchPos = {}
    this.diffPos = {x: 0, y: 0, z: 0}

    this.touchstart = touchstart
    this.touchmove = touchmove
    this.touchend = touchend

    this.initEvent()
  }

  initEvent() {
    this.canvas.addEventListener(
      "touchstart",
      (e => {
        e.preventDefault();

        this.touchPos = this.normalizeTouchPos(e);
        this.startPos = this.touchPos

        this.touchstart && this.touchstart(Object.assign({}, this.startPos))
      }).bind(this)
    );

    this.canvas.addEventListener(
      "touchmove",
      (e => {
        e.preventDefault();

        this.touchPos = this.normalizeTouchPos(e);
        this.diffPos = {
            x: this.touchPos.x - this.startPos.x,
            y: this.touchPos.y - this.startPos.y,
            z: this.touchPos.z - this.startPos.z || 0
        }

        this.touchmove && this.touchmove(Object.assign({}, this.diffPos), Object.assign({}, this.touchPos), Object.assign({}, this.startPos))
      }).bind(this)
    );

    this.canvas.addEventListener(
      "touchend",
      (e => {
        e.preventDefault();

        this.diffPos = {x: 0, y: 0, z: 0}

        this.touchend &&  this.touchend()

      }).bind(this)
    );
  }


  normalizeTouchPos(e) {
    let x = -1 + (e.touches[0].clientX / WIDTH) * 2;
    let y = 1 - (e.touches[0].clientY / HEIGHT) * 2;
    return {
      x,
      y
    };
  }
}

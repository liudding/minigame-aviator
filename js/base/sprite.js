const THREE = require("three");
let ratio = window.devicePixelRatio;

export default class Sprite extends THREE.Sprite {
  constructor(url, onload) {
    super();
    
    let cb = texture => {
      // 如果是 canvas 则需要缩放回去，是图片的话不需要。绘制排行榜的话，记得获取开放数据域时设置 wx.getOpenDataContext().canvas.type = 'canvas'
      this.ratio = texture.image.type == "canvas" ? ratio : 1;
      this.texture = texture;
      texture.needsUpdate = true;
      texture.minFilter = texture.magFilter = THREE.LinearFilter;
      this.material = new THREE.SpriteMaterial({ map: texture });

      this.scale.set(this.width, this.height, 1);
      // this.center.set(0, 1) // anchor 设置在左上角

      if (onload) onload(this);
    };

    if (url instanceof THREE.Texture) {
      cb(url);
      return;
    }
    new THREE.TextureLoader().load(url, cb);
  }

  updateTexture() {
    this.texture.needsUpdate = true;
    this.scale.set(this.width, this.height, 1);
  }

  // 缩放回去
  get width() {
    return this.texture.image.width / this.ratio;
  }
  get height() {
    return this.texture.image.height / this.ratio;
  }
}

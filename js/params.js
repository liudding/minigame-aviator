export const Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
};

export class Params {
  constructor() {
    if (instance) {
      return instance
    }
    instance = this

    // 屏幕宽度
    this.width = window.innerWidth
    // 屏幕高度
    this.height = window.innerHeight
    // 相机比例
    this.cameraAspect = this.width / this.height
    // 设备像素比
    this.ratio = window.devicePixelRatio
  }
}
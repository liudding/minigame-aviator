const THREE = require("three");
import Sprite from './sprite'

let ratio = window.devicePixelRatio;

export default class Text2D extends Sprite {
  constructor(str, params) {
    str = str || "";
    params = params || {};
    params.str = str;
    params.font = params.font || "30px Arial";
    params.fillStyle = params.fillStyle || "#ffff00";
    params.lineWidth = params.lineWidth || 1;
    params.textAlign = params.textAlign || "left";
    params.textBaseline = params.textBaseline || "top";

    let canvas = document.createElement("canvas");
    draw(canvas, params);

    super(new THREE.CanvasTexture(canvas));

    this.canvas = canvas;
    this.params = params;
  }

  get text() {
    return this.params.str;
  }
  set text(v) {
    if (this.params.str == v) return;
    this.params.str = v;

    draw(this.canvas, this.params);
    this.updateTexture();
  }
}



function draw(canvas, params) {
  let ctx = canvas.getContext("2d");

  ctx.font = params.font;
  ctx.lineWidth = params.lineWidth;
  canvas.width = Math.max(2, ctx.measureText(params.str).width * ratio);
  canvas.height = Math.ceil((parseFloat(params.font) + 4) * ratio);
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

  ctx.save();
  ctx.scale(ratio, ratio);

  // 背景
  if (params.bgColor) {
    ctx.fillStyle = params.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = params.fillStyle;
  ctx.font = params.font;
  ctx.lineWidth = params.lineWidth;
  ctx.textAlign = params.textAlign;
  ctx.textBaseline = params.textBaseline || "top";
  ctx.fillText(params.str, 0, 0);

  ctx.restore();
}

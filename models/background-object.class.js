class BackgroundObject extends MovableObject {

  y = 0;
  width = 720;
  height = 480;

  constructor(imagePath, xOffset, parallax) {
    super().loadImage(imagePath);
    this.x = xOffset;
    this.parallax = parallax;
  }

  /**
   * draw bkg-Object by taking into account parallax (2th and 3th bkg layer) for 3d-effect; called in "world", addToMap
   * parallax 0: remain fixed, parallax 0.5: move slower than camera, parallax 1: move with camera.
   * (camera_x * this.parallay gives a negative value, thus the move is slower)
   * @param {method} ctx - method of canvas-element
   * @param {number} camera_x - current x-coordinate of camera (focussed on moving character)
   */
  drawBackground(ctx, camera_x) {
    const draw_X = this.x + camera_x * this.parallax;
    ctx.drawImage(
      this.img,
      draw_X,
      this.y,
      this.width,
      this.height
    );
  }
}
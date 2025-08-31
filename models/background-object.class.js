class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  constructor(imagePath, xOffset, parallax = 1) {
    super().loadImage(imagePath);
    this.x = xOffset;
    this.y = 480 - this.height;
    this.parallax = parallax; // 1 = bewegt sich wie Vordergrund; 0 = bleibt fix (Himmel)
  }

  drawBackground(ctx, camera_x) {
    const draw_X = this.x + camera_x * this.parallax;
    ctx.drawImage(
      this.img,
      draw_X,
      this.y,
      this.width,
      this.height
    );
    // console.log("x plus offset: ", this.x, "camera * parallax: ",  camera_x * this.parallax);
  }
}

//korrigiertes x = worldX + camera_x * parallax. Das muß beim Zeichnen berechnet werden.
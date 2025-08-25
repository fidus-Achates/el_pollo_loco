class MovableObject {
  x = 120;
  y = 280;
  img;
  width = 100;
  height = 150;

  imageCache = {};

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  // Junus' erste Version (imageCache = []): Nachteil, man kann nicht so leicht auf den einzelnen Bildpfad zugreifen.
  // loadImages(arr) {
  //   arr.forEach(path => {
  //     let img = new Image();
  //     img.src = path;
  //     this.imageCache.push(img);
  //   });
  // }

  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = path; // wieso hier nicht auch "img"? Die zwei Zeilen davor sind jetzt sinnlos(?)
    });
  }

  moveRight() {
    console.log("move right");
  }
}
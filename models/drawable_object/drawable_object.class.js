class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 280;
  width = 100;
  height = 150;

  // Lädt ein einzelnes Bild und weist es dem Objekt zu.
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  // Zeichnet das aktuelle Bild des Objekts auf das Canvas.
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // Markiert die Kollisionsbox sichtbar, falls das Objekt relevant ist.
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken ||  this instanceof Collectable_Coin || this instanceof Collectable_Bottle ||this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "red";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  // Lädt mehrere Bilder in den Cache für Animationen.
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}

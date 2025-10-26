class MovableObject extends DrawableObject {
  speed = 0.15;

  speedY = 0;
  acceleration = 2.5;

  energy = 100;
  lastHit = 0;

  otherDirection = false;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowablaObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(MovableObject) {
    return (
      this.x + this.width > MovableObject.x &&
      this.y + this.height > MovableObject.y &&
      this.x < MovableObject.x &&
      this.y < MovableObject.y + MovableObject.height
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let intervall = this.currentImage % images.length;
    let path = images[intervall];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    console.log("Moving right");
    this.x += this.speed;
  }
  moveLeft() {
    this.x -= this.speed;
  }
}

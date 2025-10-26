class Cloud extends MovableObject {

  y = 50;
  x = Math.random()*500;

  width = 500;
  height = 250;

  constructor(index = 0) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}

class Chicken extends MovableObject {
  y = 370;
  height = 60;
  width = 80;
  x = 200 + Math.random()*500;


  images_walking = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  images_dead = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

    constructor(){
    super().loadImage( "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",)


  }

}

class Chicken extends MovableObject {
	y = 370;
	height = 60;
	width = 80;
	energy = 10;
	dead = false;
	images_walking = [
		'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
		'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
		'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
	];

	images_dead = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

	constructor() {
		super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

		if ((this.energy = 0)) {
			this.loadImage(this.images_dead);
		} else {
			this.loadImages(this.images_walking);

			this.x = Math.random() * (719 * 3) + 120;
			this.speed = 0.15 + Math.random() * 0.5;

			this.animate();
		}
	}

	animate() {
		setInterval(() => {
			if (this.dead) {
				return;
			}
			this.moveLeft();
		}, 1000 / 60);

		setInterval(() => {
			if (this.dead) {
				return;
			}
			this.playAnimation(this.images_walking);
		}, 200);
	}

	die() {
		this.dead = true;
		this.loadImage(this.images_dead[0]);
		this.speed = 0;
	}
}

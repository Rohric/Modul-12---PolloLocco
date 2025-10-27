class Endboss extends MovableObject {
	images_walking = [
		'img/4_enemie_boss_chicken/1_walk/G1.png',
		'img/4_enemie_boss_chicken/1_walk/G2.png',
		'img/4_enemie_boss_chicken/1_walk/G3.png',
		'img/4_enemie_boss_chicken/1_walk/G4.png',
	];

	images_alert = [
		'img/4_enemie_boss_chicken/2_alert/G5.png',
		'img/4_enemie_boss_chicken/2_alert/G6.png',
		'img/4_enemie_boss_chicken/2_alert/G7.png',
		'img/4_enemie_boss_chicken/2_alert/G8.png',
		'img/4_enemie_boss_chicken/2_alert/G9.png',
		'img/4_enemie_boss_chicken/2_alert/G10.png',
		'img/4_enemie_boss_chicken/2_alert/G11.png',
		'img/4_enemie_boss_chicken/2_alert/G12.png',
	];

	images_attack = [
		'img/4_enemie_boss_chicken/3_attack/G13.png',
		'img/4_enemie_boss_chicken/3_attack/G14.png',
		'img/4_enemie_boss_chicken/3_attack/G15.png',
		'img/4_enemie_boss_chicken/3_attack/G16.png',
		'img/4_enemie_boss_chicken/3_attack/G17.png',
		'img/4_enemie_boss_chicken/3_attack/G18.png',
		'img/4_enemie_boss_chicken/3_attack/G19.png',
		'img/4_enemie_boss_chicken/3_attack/G20.png',
	];

	images_hurt = [
		'img/4_enemie_boss_chicken/4_hurt/G21.png',
		'img/4_enemie_boss_chicken/4_hurt/G22.png',
		'img/4_enemie_boss_chicken/4_hurt/G23.png',
	];

	images_dead = [
		'img/4_enemie_boss_chicken/5_dead/G24.png',
		'img/4_enemie_boss_chicken/5_dead/G25.png',
		'img/4_enemie_boss_chicken/5_dead/G26.png',
	];

	entering = false;
	targetX = 0;
	mode = 'alert';
	frameIndex = 0;
	attackActive = false;
	height = 400;
	width = 200;
	y=80

	constructor() {
		super();
		this.loadImages(this.images_walking);
		this.loadImages(this.images_alert);
		this.loadImages(this.images_attack);
		this.loadImages(this.images_hurt);
		this.loadImages(this.images_dead);
		this.loadImage(this.images_alert[0]);
		this.x = 719 * 3 + 600;
		this.speed = 3.5;
		this.animate();
	}

	getCurrentImages() {
		if (this.mode === 'walk') {
			return this.images_walking;
		}
		if (this.mode === 'attack') {
			return this.images_attack;
		}
		if (this.mode === 'hurt') {
			return this.images_hurt;
		}
		if (this.mode === 'dead') {
			return this.images_dead;
		}
		return this.images_alert;
	}

	animate() {
		setInterval(() => {
			const images = this.getCurrentImages();
			if (!images.length) {
				return;
			}
			if (this.frameIndex >= images.length) {
				this.frameIndex = 0;
			}
			const path = images[this.frameIndex];
			this.img = this.imageCache[path];
			this.frameIndex++;

			if (this.mode === 'attack' && this.frameIndex >= images.length) {
				this.mode = 'alert';
				this.frameIndex = 0;
				this.attackActive = false;
			}

			if (this.mode === 'hurt' && this.frameIndex >= images.length) {
				this.mode = 'alert';
				this.frameIndex = 0;
			}

			if (this.mode === 'dead' && this.frameIndex >= images.length) {
				this.frameIndex = images.length - 1;
			}
		}, 200);
	}

	startEntrance(targetPosition) {
		this.targetX = targetPosition;
		this.entering = true;
		this.mode = 'walk';
		this.frameIndex = 0;
	}

	update() {
		if (this.entering && this.x > this.targetX) {
			this.moveLeft();
			if (this.x <= this.targetX) {
				this.entering = false;
				this.mode = 'alert';
				this.frameIndex = 0;
			}
		}
	}

	startAttack() {
		if (this.entering || this.mode === 'dead' || this.attackActive) {
			return false;
		}
		this.mode = 'attack';
		this.frameIndex = 0;
		this.attackActive = true;
		return true;
	}

showHurt() {
    if (this.mode === 'dead') {
        return;
    }
    this.attackActive = false;   // <— nach Flaschentreffer wieder freigeben
    this.mode = 'hurt';
    this.frameIndex = 0;
}

die() {
    this.attackActive = false;   // <— falls du ihn später killst
    this.mode = 'dead';
    this.frameIndex = 0;
}

}

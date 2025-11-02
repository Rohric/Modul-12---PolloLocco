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
	y = 80;

	spawnHandler = null;
	baseX = null;
	attackPhase = null;
	attackMovementInterval = null;
	attackForwardOffset = 560;

	constructor() {
		super();
		this.loadImages(this.images_walking);
		this.loadImages(this.images_alert);
		this.loadImages(this.images_attack);
		this.loadImages(this.images_hurt);
		this.loadImages(this.images_dead);
		this.loadImage(this.images_alert[0]);
		this.x = 719 * 3 + 600;
		this.baseX = this.x;
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
				this.frameIndex = 0;
				if (this.attackPhase === 'first-strike') {
					this.startAdvancePhase();
					return;
				}
				if (this.attackPhase === 'second-strike') {
					this.startRetreatPhase();
					return;
				}
				if (!this.attackPhase) {
					this.mode = 'alert';
					this.attackActive = false;
				}
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

	update() {
		if (this.entering && this.x > this.targetX) {
			this.moveLeft();
			if (this.x <= this.targetX) {
				this.entering = false;
				this.mode = 'alert';
				this.frameIndex = 0;
				this.baseX = this.targetX;
			}
		}
	}

	setSpawnHandler(handler) {
		this.spawnHandler = handler;
	}

	requestSpawn() {
		if (typeof this.spawnHandler === 'function') {
			this.spawnHandler();
		}
	}

	startEntrance(targetPosition) {
		this.targetX = targetPosition;
		this.baseX = targetPosition;
		this.entering = true;
		this.mode = 'walk';
		this.frameIndex = 0;
	}

	startAttackSequence() {
		if (this.attackActive || this.entering || this.mode === 'dead' || this.mode === 'removed') {
			return;
		}
		if (this.baseX === null) {
			this.baseX = this.x;
		}
		this.clearAttackMovement();
		this.attackActive = true;
		this.attackPhase = 'first-strike';
		this.mode = 'attack';
		this.frameIndex = 0;
		this.otherDirection = false;
		this.requestSpawn();
	}

	startAdvancePhase() {
		this.attackPhase = 'advance';
		this.mode = 'walk';
		this.otherDirection = false;
		const destination = Math.max(this.baseX - this.attackForwardOffset, this.baseX - 860);
		this.beginMovement(destination, () => {
			this.attackPhase = 'second-strike';
			this.mode = 'attack';
			this.frameIndex = 0;
			this.otherDirection = false;
			this.requestSpawn();
		});
	}

	startRetreatPhase() {
		this.attackPhase = 'retreat';
		this.mode = 'walk';
		this.otherDirection = true;
		this.beginMovement(this.baseX, () => {
			this.attackPhase = null;
			this.otherDirection = false;
			this.mode = 'alert';
			this.attackActive = false;
			this.frameIndex = 0;
		});
	}

	beginMovement(targetX, onComplete) {
		this.clearAttackMovement();
		const direction = targetX < this.x ? -1 : 1;
		this.otherDirection = direction > 0;
		this.attackMovementInterval = setInterval(() => {
			if (direction < 0) {
				this.moveLeft();
				if (this.x <= targetX) {
					this.x = targetX;
					this.clearAttackMovement();
					onComplete?.();
				}
			} else {
				this.moveRight();
				if (this.x >= targetX) {
					this.x = targetX;
					this.clearAttackMovement();
					onComplete?.();
				}
			}
		}, 1000 / 60);
	}

	clearAttackMovement() {
		if (this.attackMovementInterval) {
			clearInterval(this.attackMovementInterval);
			this.attackMovementInterval = null;
		}
	}

	showHurt() {
		if (this.mode === 'dead') {
			return;
		}
		this.clearAttackMovement();
		this.attackPhase = null;
		this.attackActive = false;
		this.mode = 'hurt';
		this.frameIndex = 0;
	}

	hit() {
		this.energy -= 10;
		if (this.energy <= 0) {
			this.energy = 0;
			this.die();
		} else {
			this.showHurt();
		}
	}

	die() {
		this.clearAttackMovement();
		this.mode = 'dead';
		this.frameIndex = 0;
		this.attackActive = false;
		setTimeout(() => {
			this.energy = 0;
			this.mode = 'removed';
		}, 1000);
	}
}

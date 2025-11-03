/**
 * Player character "Pepe" with movement, animation and combat behaviour.
 */
class Character extends MovableObject {
	height = 280;
	y = 170;
	groundLevel = 170;
	speed = 10;

	offset = { top: 60, right: 32, bottom: 18, left: 32 };

	images_idle = [
		'img/2_character_pepe/1_idle/idle/I-1.png',
		'img/2_character_pepe/1_idle/idle/I-2.png',
		'img/2_character_pepe/1_idle/idle/I-3.png',
		'img/2_character_pepe/1_idle/idle/I-4.png',
		'img/2_character_pepe/1_idle/idle/I-5.png',
		'img/2_character_pepe/1_idle/idle/I-6.png',
		'img/2_character_pepe/1_idle/idle/I-7.png',
		'img/2_character_pepe/1_idle/idle/I-8.png',
		'img/2_character_pepe/1_idle/idle/I-9.png',
		'img/2_character_pepe/1_idle/idle/I-10.png',
	];

	images_walking = [
		'img/2_character_pepe/2_walk/W-21.png',
		'img/2_character_pepe/2_walk/W-22.png',
		'img/2_character_pepe/2_walk/W-23.png',
		'img/2_character_pepe/2_walk/W-24.png',
		'img/2_character_pepe/2_walk/W-25.png',
		'img/2_character_pepe/2_walk/W-26.png',
	];

	images_jumping = [
		'img/2_character_pepe/3_jump/J-31.png',
		'img/2_character_pepe/3_jump/J-32.png',
		'img/2_character_pepe/3_jump/J-33.png',
		'img/2_character_pepe/3_jump/J-34.png',
		'img/2_character_pepe/3_jump/J-35.png',
		'img/2_character_pepe/3_jump/J-36.png',
		'img/2_character_pepe/3_jump/J-37.png',
		'img/2_character_pepe/3_jump/J-38.png',
		'img/2_character_pepe/3_jump/J-39.png',
	];

	images_dead = [
		'img/2_character_pepe/5_dead/D-51.png',
		'img/2_character_pepe/5_dead/D-52.png',
		'img/2_character_pepe/5_dead/D-53.png',
		'img/2_character_pepe/5_dead/D-54.png',
		'img/2_character_pepe/5_dead/D-55.png',
		'img/2_character_pepe/5_dead/D-56.png',
		'img/2_character_pepe/5_dead/D-57.png',
	];

	images_hurt = [
		'img/2_character_pepe/4_hurt/H-41.png',
		'img/2_character_pepe/4_hurt/H-42.png',
		'img/2_character_pepe/4_hurt/H-43.png',
	];

	world;
	walkingSoundActive = false;

	/**
	 * Loads all sprite sheets and starts movement handling plus gravity.
	 */
	constructor() {
		super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
		this.loadImages(this.images_idle);
		this.loadImages(this.images_walking);
		this.loadImages(this.images_jumping);
		this.loadImages(this.images_dead);
		this.loadImages(this.images_hurt);

		this.animate();
		this.applyGravity();
		this.x = -100
	}

	/**
	 * Handles user input, movement sounds and animation states.
	 */
	animate() {
		setInterval(() => {
			const movingRight = this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
			const movingLeft = this.world.keyboard.LEFT && this.x > -600;

			if (movingRight) {
				this.moveRight();
				this.otherDirection = false;
			}
			if (movingLeft) {
				this.moveLeft();
				this.otherDirection = true;
			}

			if (this.world.keyboard.SPACE && !this.isAboveGround()) {
				this.jump();
			}

			const movingHorizontally = movingRight || movingLeft;
			const grounded = !this.isAboveGround();
			const ableToWalkSound = !this.isDead() && !this.isHurt();

			if (movingHorizontally && grounded && ableToWalkSound) {
				this.startWalkingSound();
			} else {
				this.stopWalkingSound();
			}

			this.world.camera_x = -this.x + 100;
		}, 1000 / 60);

		setInterval(() => {
			this.playAnimation(this.images_idle);
			if (this.isDead()) {
				this.playAnimation(this.images_dead);
			} else if (this.isHurt()) {
				this.playAnimation(this.images_hurt);
			} else if (this.isAboveGround()) {
				this.playAnimation(this.images_jumping);
			} else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
				this.playAnimation(this.images_walking);
			}
		}, 120);
	}

	/**
	 * Gives the player an upward impulse and plays the jump sound.
	 */
	jump() {
		this.speedY = 24;
		this.world.audio.playSound('pepe_jump');
	}

	/**
	 * Starts the looping walking sound if it is not already active.
	 */
	startWalkingSound() {
		if (this.walkingSoundActive) {
			return;
		}
		this.world.audio.playSound('pepe_walk');
		this.walkingSoundActive = true;
	}

	/**
	 * Stops the walking sound if it is currently playing.
	 */
	stopWalkingSound() {
		if (!this.walkingSoundActive) {
			return;
		}
		this.world.audio.stopSound('pepe_walk');
		this.walkingSoundActive = false;
	}

	/**
	 * Determines whether the character hits an enemy from above.
	 * @param {MovableObject} enemy - Target enemy instance.
	 * @returns {boolean} True if the stomp defeated the enemy.
	 */
	smash(enemy) {
		const playerBounds = this.boundsWithOffset();
		const enemyBounds = enemy.boundsWithOffset();

		const overlap = playerBounds.bottom - enemyBounds.top;

		if (overlap > 0 && overlap < 24 && this.speedY < 0) {
			enemy.energy = 0;
			this.speedY = 24;
			return true;
		}
		return false;
	}
}

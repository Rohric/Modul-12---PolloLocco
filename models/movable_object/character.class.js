/**
 * Player character "Pepe" with movement, animation and combat behaviour.
 */
class Character extends MovableObject {
	height = 280;
	y = 170;
	groundLevel = 170;
	speed = 10;

	offset = { top: 60, right: 32, bottom: 18, left: 32 };

	images_sleep = [
		'img/2_character_pepe/1_idle/long_idle/I-11.png',
		'img/2_character_pepe/1_idle/long_idle/I-12.png',
		'img/2_character_pepe/1_idle/long_idle/I-13.png',
		'img/2_character_pepe/1_idle/long_idle/I-14.png',
		'img/2_character_pepe/1_idle/long_idle/I-15.png',
		'img/2_character_pepe/1_idle/long_idle/I-16.png',
		'img/2_character_pepe/1_idle/long_idle/I-17.png',
		'img/2_character_pepe/1_idle/long_idle/I-18.png',
		'img/2_character_pepe/1_idle/long_idle/I-19.png',
		'img/2_character_pepe/1_idle/long_idle/I-20.png',
	];

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

	sleepDelay = 5000; // ms
	isSleeping = false;
	lastActiveAt = Date.now();

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
    this.loadImages(this.images_sleep);

    this.animate();
    this.applyGravity();
    this.x = -100;
    this.lastActiveAt = Date.now();
  }

	/**
	 * Handles user input, movement sounds and animation states.
	 */
animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  startMovementLoop() {
    setInterval(() => {
      const movement = this.handleHorizontalMovement();
      this.handleJumpInput();
      this.updateWalkingSoundState(movement);
      this.updateCameraOffset();
    }, 1000 / 60);
  }

  startAnimationLoop() {
    setInterval(() => {
      this.updateAnimationState();
    }, 120);
  }

  handleHorizontalMovement() {
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

    if (movingRight || movingLeft) {
      this.registerActivity();
    }

    return { movingRight, movingLeft };
  }

  handleJumpInput() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.registerActivity();
    }
  }

  updateWalkingSoundState({ movingRight, movingLeft }) {
    const movingHorizontally = movingRight || movingLeft;
    const grounded = !this.isAboveGround();
    const ableToWalkSound = !this.isDead() && !this.isHurt();

    if (movingHorizontally && grounded && ableToWalkSound) {
      this.startWalkingSound();
    } else {
      this.stopWalkingSound();
    }
  }

  updateCameraOffset() {
    this.world.camera_x = -this.x + 100;
  }

 updateAnimationState() {
  if (!this.isIdleState()) {
    this.registerActivity();
  } else {
    this.tryEnterSleep();
  }

  this.playAnimation(this.resolveAnimationFrames());
}

resolveAnimationFrames() {
  if (this.isSleeping) {
    return this.images_sleep;
  }
  if (this.isDead()) {
    return this.images_dead;
  }
  if (this.isHurt()) {
    return this.images_hurt;
  }
  if (this.isAboveGround()) {
    return this.images_jumping;
  }
  if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
    return this.images_walking;
  }
  return this.images_idle;
}

  isIdleState() {
    const keyboard = this.world?.keyboard;
    const noHorizontalInput = !keyboard?.LEFT && !keyboard?.RIGHT;
    const noJumpInput = !keyboard?.SPACE;
    const grounded = !this.isAboveGround();
    return grounded && noHorizontalInput && noJumpInput && !this.isDead() && !this.isHurt();
  }

  tryEnterSleep() {
    if (this.isSleeping) {
      return;
    }
    if (Date.now() - this.lastActiveAt >= this.sleepDelay) {
      this.enterSleep();
    }
  }

  enterSleep() {
    this.isSleeping = true;
    this.frameIndex = 0;
    this.stopWalkingSound();
  }

  registerActivity() {
    this.lastActiveAt = Date.now();
    if (this.isSleeping) {
      this.isSleeping = false;
      this.frameIndex = 0;
    }
  }

  hit() {
    const wasSleeping = this.isSleeping;
    super.hit();
    this.registerActivity();
    if (wasSleeping && !this.isDead() && !this.isAboveGround()) {
      this.jump();
    }
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

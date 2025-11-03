/**
 * Giant boss chicken with multi-phase attack behaviour.
 */
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

	offset = { top: 80, right: 40, bottom: 40, left: 40 };

	world = null;
	spawnHandler = null;
	baseX = null;
	attackMovementInterval = null;

	isChasing = false;
	chaseSpeed = 4.2;
	isChasePaused = false;
	chaseAttackInterval = null;
	resumeChaseTimeout = null;
	rageTimeout = null;
	currentTarget = null;

	animationFrameDelay = 200;
	/**
	 * Loads all required sprites and starts the idle animation.
	 */
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

	/**
	 * Chooses the correct sprite list for the current boss mode.
	 * @returns {string[]} Array of frame paths.
	 */
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

	/**
	 * Keeps animations in sync with the current boss state.
	 */
	animate() {
		setInterval(() => {
			const frames = this.getCurrentImages();
			if (!frames.length) {
				return;
			}
			this.advanceFrame(frames);
		}, 200);
	}

	advanceFrame(frames) {
		const lastFrame = frames.length - 1;

		if (this.mode === 'dead' && this.frameIndex >= frames.length) {
			this.frameIndex = lastFrame;
		} else if (this.frameIndex >= frames.length) {
			this.frameIndex = 0;
		}
		this.img = this.imageCache[frames[this.frameIndex]];
		this.frameIndex++;
		if (this.mode === 'hurt' && this.frameIndex > lastFrame) {
			this.mode = 'alert';
			this.frameIndex = 0;
		}
		if (this.mode === 'dead') {
			this.frameIndex = Math.min(this.frameIndex, lastFrame);
		}
	}

	/**
	 * Updates the entrance animation until the boss reaches the arena.
	 */
	update() {
		this.handleEntrance();
		this.handleChase();
	}

	handleEntrance(){
				if (this.entering && this.x > this.targetX) {
			this.moveLeft();
			if (this.x <= this.targetX) {
				this.entering = false;
				this.mode = 'alert';
				this.frameIndex = 0;
				this.baseX = this.targetX;
				this.startRage();
			}
		}
	}

	handleChase(){
				if (this.isChasing && !this.isChasePaused && this.currentTarget) {
			const difference = this.currentTarget.x - this.x;
			const direction = difference < 0 ? -1 : 1;
			this.otherDirection = direction > 0;
			this.x += direction * this.chaseSpeed;
		}
	}
	
	/**
	 * Registers a callback that spawns minions during an attack.
	 * @param {() => void} handler - Function to execute on spawn requests.
	 */
	setSpawnHandler(handler) {
		this.spawnHandler = handler;
	}

	/**
	 * Requests the current spawn handler to create additional enemies.
	 */
	requestSpawn() {
		if (typeof this.spawnHandler === 'function') {
			this.spawnHandler();
		}
	}

	/**
	 * Starts the entrance sequence towards the fighting position.
	 * @param {number} targetPosition - X coordinate to reach.
	 */
	startEntrance(targetPosition) {
		this.targetX = targetPosition;
		this.baseX = targetPosition;
		this.entering = true;
		this.mode = 'walk';
		this.frameIndex = 0;
	}

	/**
	 * Compatibility helper for existing attack triggers.
	 */
	startAttackSequence() {
		this.startRage();
	}

	/**
	 * Initiates the rage animation and summons minions.
	 */
	startRage() {
		if (
			this.entering ||
			this.attackActive ||
			this.isChasing ||
			this.attackMovementInterval ||
			this.mode === 'dead' ||
			this.mode === 'removed'
		) {
			return;
		}
		if (this.baseX === null) {
			this.baseX = this.x;
		}
		this.clearAttackMovement();
		this.clearTimers();

		this.mode = 'attack';
		this.attackActive = true;
		this.otherDirection = false;
		this.frameIndex = 0;
		this.requestSpawn();

		this.rageTimeout = setTimeout(() => this.beginChase(), 1200);
	}

	/**
	 * Starts moving toward the player after the rage outburst.
	 */
	beginChase() {
		this.rageTimeout = null;
		if (this.mode === 'dead' || this.mode === 'removed') {
			return;
		}

		this.attackActive = false;
		this.isChasing = true;
		this.isChasePaused = false;
		this.mode = 'walk';
		this.frameIndex = 0;
		this.currentTarget = this.world?.character ?? null;

		if (!this.currentTarget) {
			this.endChase(false);
			return;
		}

		this.startChaseAttackCycle();
	}

	/**
	 * Arms the repeating chase attack cycle.
	 */
	startChaseAttackCycle() {
		this.stopChaseAttackCycle();
		this.chaseAttackInterval = setInterval(() => this.performChaseAttack(), 3000);
	}

	/**
	 * Cancels the repeating chase attack cycle.
	 */
	stopChaseAttackCycle() {
		if (this.chaseAttackInterval) {
			clearInterval(this.chaseAttackInterval);
			this.chaseAttackInterval = null;
		}
	}

	/**
	 * Executes an attack burst during the chase and resumes pursuit afterwards.
	 */
	performChaseAttack() {
		if (!this.isChasing || this.mode === 'dead' || this.mode === 'removed') {
			this.stopChaseAttackCycle();
			return;
		}

		this.isChasePaused = true;
		this.mode = 'attack';
		this.attackActive = true;
		this.frameIndex = 0;
		if (this.currentTarget) {
			this.otherDirection = this.currentTarget.x > this.x;
		}
		this.requestSpawn();

		if (this.resumeChaseTimeout) {
			clearTimeout(this.resumeChaseTimeout);
		}
		this.resumeChaseTimeout = setTimeout(() => this.resumeChaseAfterAttack(), 1200);
	}

	/**
	 * Resumes the pursuit once the mid-chase attack completed.
	 */
	resumeChaseAfterAttack() {
		this.resumeChaseTimeout = null;
		if (!this.isChasing || this.mode === 'dead' || this.mode === 'removed') {
			return;
		}

		this.attackActive = false;
		this.mode = 'walk';
		this.frameIndex = 0;
		this.isChasePaused = false;
	}

	/**
	 * Stops the current chase, returns to base and optionally starts another rage.
	 * @param {boolean} triggerFollowUp - Whether to trigger another attack cycle afterwards.
	 */
	endChase(triggerFollowUp = true) {
		this.cancelChase();
		if (this.mode === 'dead' || this.mode === 'removed') {
			return;
		}

		this.mode = 'walk';
		this.attackActive = false;
		const directionToBase = this.baseX < this.x ? -1 : 1;
		this.otherDirection = directionToBase > 0;

		this.beginMovement(this.baseX, () => {
			this.otherDirection = false;
			this.mode = 'alert';
			this.frameIndex = 0;
			this.attackActive = false;

			if (triggerFollowUp) {
				this.startRage();
			}
		});
	}

	/**
	 * Cancels all pending chase timers and resets flags.
	 */
	cancelChase() {
		this.stopChaseAttackCycle();
		if (this.resumeChaseTimeout) {
			clearTimeout(this.resumeChaseTimeout);
			this.resumeChaseTimeout = null;
		}
		this.isChasing = false;
		this.isChasePaused = false;
		this.currentTarget = null;
	}

	/**
	 * Clears all temporal behaviour timers (rage + chase).
	 */
	clearTimers() {
		if (this.rageTimeout) {
			clearTimeout(this.rageTimeout);
			this.rageTimeout = null;
		}
		this.cancelChase();
		this.attackActive = false;
	}

	/**
	 * Reacts to a direct collision with the player character.
	 * @param {World} world - Current world instance.
	 */
	onPlayerCollision(world) {
		if (!this.isChasing || this.mode === 'dead' || this.mode === 'removed') {
			return;
		}
		this.endChase(true);
	}

	/**
	 * Moves the boss toward a target and triggers a callback when the position is reached.
	 * @param {number} targetX - Destination X coordinate.
	 * @param {() => void} onComplete - Callback executed once the movement finishes.
	 */
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

	/**
	 * Cancels any running positional attack movement.
	 */
	clearAttackMovement() {
		if (this.attackMovementInterval) {
			clearInterval(this.attackMovementInterval);
			this.attackMovementInterval = null;
		}
	}

	/**
	 * Interrupts attacks and shows the hurt animation.
	 */
	showHurt() {
		if (this.mode === 'dead') {
			return;
		}
		this.clearAttackMovement();
		this.clearTimers();
		this.attackActive = false;
		this.mode = 'hurt';
		this.frameIndex = 0;
	}

	/**
	 * Applies damage to the boss and triggers death handling if necessary.
	 */
	hit() {
		this.energy -= 10;
		if (this.energy <= 0) {
			this.energy = 0;
			this.die();
		} else {
			this.showHurt();
		}
	}

	/**
	 * Starts the death animation and marks the boss as removed afterwards.
	 */
	die() {
		this.clearAttackMovement();
		this.clearTimers();
		this.mode = 'dead';
		this.frameIndex = 0;
		this.attackActive = false;
		setTimeout(() => {
			this.energy = 0;
			this.mode = 'removed';
		}, 1000);
	}
}

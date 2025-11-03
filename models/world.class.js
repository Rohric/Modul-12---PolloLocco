/**
 * Coordinates the main game world including rendering, collisions and audio.
 */
class World {
	character = new Character();
	level = level1;

	canvas;
	ctx;
	keyboard;
	camera_x = -0;
	statusBar = new StatusBar_Health();
	statusBar_Bottle = new StatusBar_Bottle();
	statusBar_Coin = new StatusBar_Coin();
	statusBar_Endboss = new StatusBar_Endboss();

	throwableObjects = [];
	lastThrow = 0;
	throwCooldown = 500;

	collisionInterval = null;
	collectableInterval = null;
	animationId = null;

	bossTriggered = false;
	endboss = null;
	bossAttackInterval = null;

	audio = null;
	gameHasEnded = false;

	/**
	 * Creates the world, wires the canvas/context and starts all loops.
	 * @param {HTMLCanvasElement} canvas - Target canvas element.
	 * @param {Keyboard} keyboard - Keyboard input handler.
	 * @param {AudioManager} audioManager - Shared audio manager instance.
	 */
	constructor(canvas, keyboard, audioManager) {
		this.ctx = canvas.getContext('2d');
		this.canvas = canvas;
		this.keyboard = keyboard || new Keyboard();
		this.audio = audioManager || null;
		this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
		if (this.endboss) {
			this.endboss.setSpawnHandler(() => this.spawnAttackChickens());
			this.endboss.world = this;
		}

		this.draw();
		this.setWorld();
		this.run();
	}

	/**
	 * Gives the character access to the world instance.
	 */
	setWorld() {
		this.character.world = this;
	}

	/**
	 * Starts the core intervals that handle collisions and collectibles.
	 */
	run() {
		this.collisionInterval = setInterval(() => {
			this.checkCollisions();
			this.checkThrowableHits();
		}, 1000 / 60);

		this.collectableInterval = setInterval(() => {
			this.checkCollectables();
			this.checkThrowObjects();
		}, 100);
	}

	/**
	 * Clears an interval/timeout stored as property and nulls it.
	 * @param {'collisionInterval'|'collectableInterval'|'bossAttackInterval'} refName
	 * @param {Function} clearer
	 */
	clearTimer(refName, clearer = clearInterval) {
		const handle = this[refName];
		if (!handle) {
			return;
		}
		clearer(handle);
		this[refName] = null;
	}

	/**
	 * Cancels the active animation frame request if present.
	 */
	cancelAnimation() {
		if (!this.animationId) {
			return;
		}
		cancelAnimationFrame(this.animationId);
		this.animationId = null;
	}

	/**
	 * Stops all active loops and the rendering cycle.
	 */
	destroy() {
		this.clearTimer('collisionInterval');
		this.clearTimer('collectableInterval');
		this.clearTimer('bossAttackInterval');
		this.cancelAnimation();
		if (this.endboss) {
			this.endboss.clearTimers();
			this.endboss.clearAttackMovement();
			this.endboss.world = null;
		}
	}

	/**
	 * Ends the current round, shuts down all loops and shows the matching overlay.
	 * @param {'win'|'loss'} outcome - Determines which overlay becomes visible.
	 */
	finishGame(outcome) {
		if (this.gameHasEnded) {
			return;
		}
		this.gameHasEnded = true;

		this.destroy();
		this.audio?.stopSound('background_wildwest');

		this.updateOverlays(outcome);
	}

	updateOverlays(outcome) {
		const { canvas, start, win, lost } = this.lookupOverlays();

		canvas?.classList.add('d_none');
		start?.classList.add('d_none');

		const showWin = outcome === 'win';
		win?.classList.toggle('d_none', !showWin);
		lost?.classList.toggle('d_none', showWin);
	}

	lookupOverlays() {
		return {
			canvas: document.getElementById('canvas'),
			start: document.getElementById('overlayGameScreen'),
			win: document.getElementById('overlayGameScreenWON'),
			lost: document.getElementById('overlayGameScreenLOST'),
		};
	}

	/**
	 * Spawns throwable bottles when the player presses the throw key
	 * and the cooldown has elapsed.
	 */
	checkThrowObjects() {
		if (!this.canAttemptThrow()) {
			return;
		}

		const now = Date.now();
		if (this.isThrowOnCooldown(now)) {
			return;
		}

		this.registerThrow(now);
		this.spawnBottle();
		this.consumeBottleCharge();
	}

	/**
	 * Determines whether the player currently satisfies every
	 * prerequisite for throwing a bottle.
	 * @returns {boolean} True if a throw may be attempted.
	 */
	canAttemptThrow() {
		return this.keyboard.D && this.statusBar_Bottle.percentage > 0;
	}

	/**
	 * Verifies the cooldown timer for bottle throws.
	 * @param {number} timestamp - Current timestamp in milliseconds.
	 * @returns {boolean} True if the cooldown is still active.
	 */
	isThrowOnCooldown(timestamp) {
		return timestamp - this.lastThrow < this.throwCooldown;
	}

	/**
	 * Updates the internal state to remember when the last throw occurred.
	 * @param {number} timestamp - Timestamp in milliseconds.
	 */
	registerThrow(timestamp) {
		this.lastThrow = timestamp;
	}

	/**
	 * Creates a new throwable bottle and adds it to the active projectiles.
	 */
	spawnBottle() {
		const direction = this.character.otherDirection ? -1 : 1;
		const offsetX = this.character.x + (direction === 1 ? 100 : -60);
		const offsetY = this.character.y + 100;
		const bottle = new ThrowablaObject(offsetX, offsetY, direction);
		this.throwableObjects.push(bottle);
	}

	/**
	 * Reduces the bottle status bar after a throw.
	 */
	consumeBottleCharge() {
		const nextValue = Math.max(0, this.statusBar_Bottle.percentage - 10);
		this.statusBar_Bottle.setPercentage(nextValue);
	}

	/**
	 * Resolves collisions between the character and enemies.
	 */
	checkCollisions() {
		this.level.enemies.forEach((enemy) => this.handleEnemyCollision(enemy));
	}

	/**
	 * Handles collision logic for a single enemy instance.
	 * @param {MovableObject} enemy - Enemy currently intersecting the character.
	 */
	handleEnemyCollision(enemy) {
		if (!this.character.isColliding(enemy) || enemy.dead) {
			return;
		}
		if (enemy instanceof Endboss) {
			enemy.onPlayerCollision(this);
		}
		if (this.handleEnemySmash(enemy) || this.character.isHurt()) {
			return;
		}
		this.handleHeroHit();
	}

	/**
	 * Resolves a stomp kill and removes the enemy when successful.
	 * @param {MovableObject} enemy - Enemy to evaluate.
	 * @returns {boolean} True when the enemy was smashed.
	 */
	handleEnemySmash(enemy) {
		if (!this.character.smash(enemy)) {
			return false;
		}
		enemy.die();
		this.spawnEnemyLoot(enemy);

		this.audio?.playSound('chicken_death');
		setTimeout(() => {
			const idx = this.level.enemies.indexOf(enemy);
			if (idx !== -1) {
				this.level.enemies.splice(idx, 1);
			}
		}, 700);
		return true;
	}

	/**
	 * Spawns a coin or bottle collectible at the defeated enemy's position.
	 * @param {MovableObject} enemy - Enemy that dropped the loot.
	 */
	spawnEnemyLoot(enemy) {
		const drop = Math.random() < 0.5 ? new Collectable_Coin() : new Collectable_Bottle();
		drop.x = enemy.x;
		drop.y = enemy.y + enemy.height - drop.height;
		drop.collected = false;
		if (drop instanceof Collectable_Coin) {
			this.level.collectableCoin.push(drop);
		} else {
			this.level.collectableBottle.push(drop);
		}
	}

	/**
	 * Applies damage handling when the character is hit by an enemy.
	 */
	handleHeroHit() {
		this.character.hit();
		this.statusBar.setPercentage(this.character.energy);
		if (this.character.energy <= 0) {
			this.finishGame('loss');
		}
	}

	/**
	 * Switches the UI/state when the player runs out of energy.
	 */
	handleGameOver() {
		this.finishGame('loss');
	}

	/**
	 * Picks up coins and bottles as soon as the character touches them.
	 */
	checkCollectables() {
		this.level.collectableCoin.forEach((coin) => {
			if (coin.isCollect(this.character)) {
				this.statusBar_Coin.setPercentage(this.statusBar_Coin.percentage + 20);
			}
		});

		this.level.collectableBottle.forEach((bottle) => {
			if (bottle.isCollect(this.character)) {
				let percent = this.statusBar_Bottle.percentage + 10;
				if (percent > 100) {
					percent = 100;
				}
				this.statusBar_Bottle.setPercentage(percent);
			}
		});
	}

	/**
	 * Checks whether the boss fight should be triggered and manages the attack loop.
	 */
	checkBossEntrance() {
		let triggerX = 2100;
		let stopX = 719 * 3 + 200;

		if (!this.bossTriggered && this.character.x > triggerX) {
			this.bossTriggered = true;
			if (this.endboss) {
				this.endboss.startEntrance(stopX);
				this.slideEndbossBar();
				this.startBossAttackLoop();
				this.audio?.playSound('background_wildwest');
			}
		}

		if (this.endboss) {
			this.endboss.update();
		}
	}

	/**
	 * Starts the periodic boss attack check loop.
	 */
	startBossAttackLoop() {
		if (this.bossAttackInterval || !this.endboss) {
			return;
		}
		this.bossAttackInterval = setInterval(() => {
			if (!this.endboss || this.endboss.entering || this.endboss.mode === 'dead' || this.endboss.mode === 'removed') {
				return;
			}
			this.endboss.startAttackSequence();
		}, 5000);
	}

	/**
	 * Slides the endboss status bar into the HUD view.
	 */
	slideEndbossBar() {
		const margin = 10;
		const targetX = Math.max(margin, this.canvas.width - this.statusBar_Endboss.width - margin);
		let speed = 8;

		if (this.statusBar_Endboss.x <= targetX) {
			this.statusBar_Endboss.x = this.canvas.width + this.statusBar_Endboss.width;
		}

		const move = () => {
			if (this.statusBar_Endboss.x > targetX) {
				this.statusBar_Endboss.x -= speed;
				if (this.statusBar_Endboss.x < targetX) {
					this.statusBar_Endboss.x = targetX;
				}
				requestAnimationFrame(move);
			}
		};

		requestAnimationFrame(move);
	}

	/**
	 * Spawns attacking chickens during boss phases.
	 */
	spawnAttackChickens() {
		for (let i = 0; i < 5; i++) {
			const chicken = new Chicken();
			chicken.x = Math.random() * 1200 + 719 * 3 + 500;
			this.level.enemies.push(chicken);
		}
	}

	/**
	 * Handles collisions between thrown bottles and the endboss.
	 */
	checkThrowableHits() {
		if (!this.endboss) {
			this.filterActiveBottles();
			return;
		}

		this.handleBossBottleHits();
		this.handleBossDefeat();
	}

	filterActiveBottles() {
		this.throwableObjects = this.throwableObjects.filter(
			(bottle) => bottle.x <= this.character.x + 2000 && bottle.y <= this.canvas.height + 200,
		);
	}

	handleBossBottleHits() {
		this.throwableObjects = this.throwableObjects.filter((bottle) => {
			if (this.endboss.isColliding(bottle)) {
				this.endboss.hit();
				this.audio.playSound('boss_hit');
				this.statusBar_Endboss.setPercentage(this.endboss.energy);
				return false;
			}
			return bottle.x <= this.character.x + 2000 && bottle.y <= this.canvas.height + 200;
		});
	}

	handleBossDefeat() {
		if (!this.endboss || this.endboss.mode !== 'removed') {
			return;
		}
		this.audio?.playSound('endboss_die');

		const defeatedBoss = this.endboss;
		const idx = this.level.enemies.indexOf(this.endboss);
		if (idx !== -1) {
			this.level.enemies.splice(idx, 1);
		}
		defeatedBoss.clearTimers();
		defeatedBoss.clearAttackMovement();
		defeatedBoss.world = null;

		this.endboss = null;
		this.finishGame('win');
	}

	/**
	 * Draws every game object and schedules the next frame.
	 */
	draw() {
		this.checkBossEntrance();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.translate(this.camera_x, 0);

		this.renderObjects();
		this.renderHUD();

		this.animationId = requestAnimationFrame(() => this.draw());
	}

	renderObjects() {
		this.addObjectsToMap(this.level.backgroundObjects);
		this.addToMap(this.character);
		this.addObjectsToMap(this.level.clouds);
		this.addObjectsToMap(this.level.enemies);
		this.addObjectsToMap(this.throwableObjects);
		this.addObjectsToMap(this.level.collectableCoin.filter((coin) => !coin.collected));
		this.addObjectsToMap(this.level.collectableBottle.filter((bottle) => !bottle.collected));
	}

	renderHUD() {
		this.ctx.translate(-this.camera_x, 0);
		this.addToMap(this.statusBar);
		this.ctx.translate(this.camera_x, 0);

		this.ctx.translate(-this.camera_x, 0);
		this.addToMap(this.statusBar_Bottle);
		this.ctx.translate(this.camera_x, 0);

		this.ctx.translate(-this.camera_x, 0);
		this.addToMap(this.statusBar_Coin);
		this.ctx.translate(this.camera_x, 0);

		this.ctx.translate(-this.camera_x, 0);
		this.addToMap(this.statusBar_Endboss);
		this.ctx.translate(this.camera_x, 0);

		this.ctx.translate(-this.camera_x, 0);
	}
	/**
	 * Adds a list of objects to the canvas in order.
	 * @param {DrawableObject[]} objects - Objects to render.
	 */
	addObjectsToMap(objects) {
		objects.forEach((object) => {
			this.addToMap(object);
		});
	}

	/**
	 * Renders a single object, taking its facing direction into account.
	 * @param {MovableObject|DrawableObject} MovableObject - Object to render.
	 */
	addToMap(MovableObject) {
		if (MovableObject.otherDirection) {
			this.flipImage(MovableObject);
		}
		MovableObject.draw(this.ctx);

		if (MovableObject.otherDirection) {
			this.flipImageBack(MovableObject);
		}
	}

	/**
	 * Mirrors an object's image horizontally.
	 * @param {MovableObject|DrawableObject} MovableObject - Object to flip.
	 */
	flipImage(MovableObject) {
		this.ctx.save();
		this.ctx.translate(MovableObject.width, 0);
		this.ctx.scale(-1, 1);
		MovableObject.x = MovableObject.x * -1;
	}

	/**
	 * Restores the previously mirrored image.
	 * @param {MovableObject|DrawableObject} MovableObject - Object to restore.
	 */
	flipImageBack(MovableObject) {
		MovableObject.x = MovableObject.x * -1;
		this.ctx.restore();
	}
}

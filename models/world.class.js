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
	collisionInterval = null;
	collectableInterval = null;
	animationId = null;

	bossTriggered = false;
	endboss = null;
	bossAttackInterval = null;

	constructor(canvas) {
		this.ctx = canvas.getContext('2d');
		this.canvas = canvas;
		this.keyboard = keyboard;
		this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
		this.draw();
		this.setWorld();
		this.run();
	}

	setWorld() {
		this.character.world = this;
	}

	run() {
		this.collisionInterval = setInterval(() => {
			this.checkCollisions();
			this.checkThrowableHits();
		}, 1000 / 60);

		this.collectableInterval = setInterval(() => {
			this.checkCollectables();
			this.checkThrowObjects();
		}, 200);
	}

	destroy() {
		if (this.collisionInterval) {
			clearInterval(this.collisionInterval);
			this.collisionInterval = null;
		}
		if (this.collectableInterval) {
			clearInterval(this.collectableInterval);
			this.collectableInterval = null;
		}
		if (this.bossAttackInterval) {
			clearInterval(this.bossAttackInterval);
			this.bossAttackInterval = null;
		}
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}

	checkThrowObjects() {
		if (this.keyboard.D && this.statusBar_Bottle.percentage > 0) {
			const direction = this.character.otherDirection ? -1 : 1;
			const offsetX = this.character.x + (direction === 1 ? 100 : -60);
			const offsetY = this.character.y + 100;
			let bottle = new ThrowablaObject(offsetX, offsetY, direction);
			this.throwableObjects.push(bottle);

			let percent = this.statusBar_Bottle.percentage - 10;
			if (percent < 0) {
				percent = 0;
			}
			this.statusBar_Bottle.setPercentage(percent);
		}
	}

	checkCollisions() {
		this.level.enemies.forEach((enemy) => {
			if (!this.character.isColliding(enemy)) {
				return;
			}

			if (enemy.dead) {
				return;
			}

			if (this.character.smash(enemy)) {
				enemy.die();

				setTimeout(() => {
					const idx = this.level.enemies.indexOf(enemy);

					this.level.enemies.splice(idx, 1);
				}, 700);
				return;
			}

			if (this.character.isHurt()) {
				return;
			}

			if (this.character.energy == 0) {
				document.getElementById('canvas').classList.add('d_none');
				document.getElementById('overlayGameScreenLOST').classList.remove('d_none');
			}

			this.character.hit();
			this.statusBar.setPercentage(this.character.energy);
		});
	}

	checkCollectables() {
		this.level.collectableCoin.forEach((coin) => {
			if (coin.isCollect(this.character)) {
				let coinBar_Percent = this.statusBar_Coin.percentage + 10;
				if (coinBar_Percent > 100) {
					coinBar_Percent = 100;
				}
				this.statusBar_Coin.setPercentage(coinBar_Percent);
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

	checkBossEntrance() {
		let triggerX = 2100;
		let stopX = 719 * 3 + 200;

		if (!this.bossTriggered && this.character.x > triggerX) {
			this.bossTriggered = true;
			if (this.endboss) {
				this.endboss.startEntrance(stopX);
				this.slideEndbossBar();
				this.startBossAttackLoop();
			}
		}

		if (this.endboss) {
			this.endboss.update();
		}
	}

	startBossAttackLoop() {
		if (this.bossAttackInterval || !this.endboss) {
			return;
		}
		this.bossAttackInterval = setInterval(() => {
			if (!this.endboss || this.endboss.entering || this.endboss.mode === 'dead') {
				return;
			}
			if (this.endboss.startAttack()) {
				this.spawnAttackChickens();
			}
		}, 5000);
	}

	slideEndbossBar() {
		const targetX = 10;
		let speed = 6;

		const move = () => {
			if (this.statusBar_Endboss.x < targetX) {
				this.statusBar_Endboss.x += speed;
				if (this.statusBar_Endboss.x > targetX) {
					this.statusBar_Endboss.x = targetX;
				}
				requestAnimationFrame(move);
			}
		};

		requestAnimationFrame(move);
	}

	spawnAttackChickens() {
		for (let i = 0; i < 5; i++) {
			const chicken = new Chicken();
			chicken.x = Math.random() * 1200 + 719 * 3 + 500;
			this.level.enemies.push(chicken);
		}
	}

	checkThrowableHits() {
		if (!this.endboss) {
			this.throwableObjects = this.throwableObjects.filter(
				(bottle) => bottle.x <= this.character.x + 2000 && bottle.y <= this.canvas.height + 200
			);
			return;
		}

		this.throwableObjects = this.throwableObjects.filter((bottle) => {
			if (this.endboss.isColliding(bottle)) {
				this.endboss.hit();
				this.statusBar_Endboss.setPercentage(this.endboss.energy);
				return false;
			}
			if (bottle.x > this.character.x + 2000 || bottle.y > this.canvas.height + 200) {
				return false;
			}
			return true;
		});

		if (this.endboss.mode === 'removed') {
			const idx = this.level.enemies.indexOf(this.endboss);
			if (idx !== -1) {
				this.level.enemies.splice(idx, 1);
			}
			this.endboss = null;
			document.getElementById('canvas').classList.add('d_none');
			document.getElementById('overlayGameScreenWON').classList.remove('d_none');
		}
	}

	draw() {
		this.checkBossEntrance();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.translate(this.camera_x, 0);

		this.addObjectsToMap(this.level.backgroundObjects);

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

		this.addToMap(this.character);
		this.addObjectsToMap(this.level.enemies);
		this.addObjectsToMap(this.level.clouds);
		this.addObjectsToMap(this.throwableObjects);
		this.addObjectsToMap(this.level.collectableCoin.filter((coin) => !coin.collected));
		this.addObjectsToMap(this.level.collectableBottle.filter((bottle) => !bottle.collected));

		this.ctx.translate(-this.camera_x, 0);

		this.animationId = requestAnimationFrame(() => this.draw());
	}

	addObjectsToMap(objects) {
		objects.forEach((object) => {
			this.addToMap(object);
		});
	}

	addToMap(MovableObject) {
		if (MovableObject.otherDirection) {
			this.flipImage(MovableObject);
		}
		MovableObject.draw(this.ctx);
		// Rotes quadrat fOr die kollisionsrechnung
		MovableObject.drawFrame(this.ctx);

		if (MovableObject.otherDirection) {
			this.flipImageBack(MovableObject);
		}
	}

	flipImage(MovableObject) {
		this.ctx.save();
		this.ctx.translate(MovableObject.width, 0);
		this.ctx.scale(-1, 1);
		MovableObject.x = MovableObject.x * -1;
	}

	flipImageBack(MovableObject) {
		MovableObject.x = MovableObject.x * -1;
		this.ctx.restore();
	}
}

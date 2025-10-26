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
	throwableObjects = [];

	constructor(canvas) {
		this.ctx = canvas.getContext('2d');
		this.canvas = canvas;
		this.keyboard = keyboard;

		this.draw();
		this.setWorld();
		this.run();
	}

	setWorld() {
		this.character.world = this;
	}

	run() {
		setInterval(() => {
			this.checkCollisions();
		}, 1000 / 60);

		setInterval(() => {
			this.checkCollectables();
			this.checkThrowObjects();
		}, 200);
	}

	checkThrowObjects() {
		if (this.keyboard.D) {
			let bottle = new ThrowablaObject(this.character.x + 100, this.character.y + 100);
			this.throwableObjects.push(bottle);
		}
	}

	checkCollisions() {
		this.level.enemies.forEach((enemy, index) => {
			if (!this.character.isColliding(enemy)) {
				return;
			}

			if (this.character.smash(enemy)) {
				this.level.enemies.splice(index, 1);
				return;
			}

			if (this.character.isHurt()) {
				return;
			}

			this.character.hit();
			this.statusBar.setPercentage(this.character.energy);

			console.log('collision with Character, enery', this.character.energy);
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
				let bottleBar_Percent = this.statusBar_Bottle.percentage + 10;
				if (bottleBar_Percent > 100) {
					bottleBar_Percent = 100;
				}
				this.statusBar_Bottle.setPercentage(bottleBar_Percent);
			}
		});
	}

	draw() {
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

		this.addToMap(this.character);
		this.addObjectsToMap(this.level.enemies);
		this.addObjectsToMap(this.level.clouds);
		this.addObjectsToMap(this.throwableObjects);
		this.addObjectsToMap(this.level.collectableCoin.filter((coin) => !coin.collected));
		this.addObjectsToMap(this.level.collectableBottle.filter((bottle) => !bottle.collected));

		this.ctx.translate(-this.camera_x, 0);

		let self = this;
		requestAnimationFrame(function () {
			self.draw();
		});
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
		// Rotes quadrat für die kollisionsrechnung
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

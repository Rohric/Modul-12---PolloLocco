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

	audio = null;

	// Erzeugt die Spielwelt, verbindet sie mit dem Canvas und startet die Hauptschleifen.
	constructor(canvas, keyboard, audioManager) {
		this.ctx = canvas.getContext('2d');
		this.canvas = canvas;
		this.keyboard = keyboard || new Keyboard();
		this.audio = audioManager || null;
		this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
		if (this.endboss) {
			this.endboss.setSpawnHandler(() => this.spawnAttackChickens());
		}

		this.draw();
		this.setWorld();
		this.run();
	}

	setWorld() {
		this.character.world = this;
	}

	// Startet die zyklischen Prüfungen für Kollisionen und sammelbare Objekte.
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

	// Stoppt alle laufenden Intervalle sowie die Zeichenschleife.
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

	// Lässt bei Tastendruck neue Flaschen entstehen und verwaltet den Vorrat.
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

	// Prüft Berührungen zwischen Spieler und Gegnern und reagiert entsprechend.
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
				this.audio?.playSound('chicken_death');

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
				// this.audio?.stopSound('background_drum');
				this.audio?.stopSound('background_wildwest');
			}

			this.character.hit();
			this.statusBar.setPercentage(this.character.energy);
		});
	}

	// Hebt Münzen und Flaschen ins Inventar, sobald der Spieler sie berührt.
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

	// Startet den Bosskampf, sobald der Spieler weit genug gelaufen ist.
	checkBossEntrance() {
		let triggerX = 2100;
		let stopX = 719 * 3 + 200;

		if (!this.bossTriggered && this.character.x > triggerX) {
			this.bossTriggered = true;
			// this.audio?.stopSound('background_drum');
			this.audio?.playSound('background_wildwest');
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

	// Lässt den Endboss regelmäßig besondere Angriffe vorbereiten.
	startBossAttackLoop() {
		if (this.bossAttackInterval || !this.endboss) {
			return;
		}
		this.bossAttackInterval = setInterval(() => {
			if (!this.endboss || this.endboss.entering || this.endboss.mode === 'dead') {
				return;
			}
			this.endboss.startAttackSequence();
		}, 5000);
	}

	// Schiebt die Anzeige des Endboss-Lebensbalkens zur sichtbaren Position.
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

	// Spawnt angreifende Hühner in Bossphasen.
	spawnAttackChickens() {
		for (let i = 0; i < 5; i++) {
			const chicken = new Chicken();
			chicken.x = Math.random() * 1200 + 719 * 3 + 500;
			this.level.enemies.push(chicken);
		}
	}

	// Verarbeitet Treffer durch geworfene Flaschen und beendet den Bosskampf.
	checkThrowableHits() {
		if (!this.endboss) {
			this.throwableObjects = this.throwableObjects.filter(
				(bottle) => bottle.x <= this.character.x + 2000 && bottle.y <= this.canvas.height + 200,
			);
			return;
		}

		this.throwableObjects = this.throwableObjects.filter((bottle) => {
			if (this.endboss.isColliding(bottle)) {
				this.endboss.hit();
				this.audio.playSound('boss_hit');

				this.statusBar_Endboss.setPercentage(this.endboss.energy);
				return false;
			}
			if (bottle.x > this.character.x + 2000 || bottle.y > this.canvas.height + 200) {
				return false;
			}
			return true;
		});

		if (this.endboss.mode === 'removed') {
			this.audio?.playSound('endboss_die');
			this.audio?.stopSound('background_wildwest');
			const idx = this.level.enemies.indexOf(this.endboss);
			if (idx !== -1) {
				this.level.enemies.splice(idx, 1);
			}
			this.endboss = null;
			document.getElementById('canvas').classList.add('d_none');
			document.getElementById('overlayGameScreenWON').classList.remove('d_none');
		}
	}

	// Zeichnet alle Spielobjekte und wiederholt die Animation per requestAnimationFrame.
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

	// Fügt eine Liste von Objekten nacheinander zur Zeichenfläche hinzu.
	addObjectsToMap(objects) {
		objects.forEach((object) => {
			this.addToMap(object);
		});
	}

	// Platziert ein einzelnes Objekt unter Berücksichtigung seiner Blickrichtung.
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

	// Spiegelt ein Bild horizontal, damit Figuren nach links schauen können.
	flipImage(MovableObject) {
		this.ctx.save();
		this.ctx.translate(MovableObject.width, 0);
		this.ctx.scale(-1, 1);
		MovableObject.x = MovableObject.x * -1;
	}

	// Hebt die vorherige Spiegelung wieder auf.
	flipImageBack(MovableObject) {
		MovableObject.x = MovableObject.x * -1;
		this.ctx.restore();
	}
}

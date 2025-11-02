class MovableObject extends DrawableObject {
	speed = 0.15;

	speedY = 0;
	acceleration = 2.5;

	energy = 100;
	lastHit = 0;

	otherDirection = false;

	// Simuliert Schwerkraft und bewegt das Objekt vertikal.
	applyGravity() {
		setInterval(() => {
			if (this.isAboveGround() || this.speedY > 0) {
				this.y -= this.speedY;
				this.speedY -= this.acceleration;
				if (this instanceof Character && this.y > this.groundLevel) {
					this.y = this.groundLevel;
					this.speedY = 0;
				}
			}
		}, 1000 / 25);
	}

	// Prüft, ob sich das Objekt über dem Boden befindet.
isAboveGround() {
  if (this instanceof ThrowablaObject) {
    return true;
  }
  if (this instanceof Character) {
    return this.y < this.groundLevel;
  }
  return this.y < 180;
}


	// Ermittelt, ob zwei Objekte sich überlappen.
	isColliding(MovableObject) {
		return (
			this.x + this.width > MovableObject.x &&
			this.y + this.height > MovableObject.y &&
			this.x < MovableObject.x &&
			this.y < MovableObject.y + MovableObject.height
		);
	}

	// Reduziert die Energie und speichert den Zeitpunkt eines Treffers.
	hit() {
		this.energy -= 5;
		if (this.energy < 0) {
			this.energy = 0;
		} else {
			this.lastHit = new Date().getTime();
		}
	}

	// Liefert zurück, ob das Objekt kürzlich Schaden erhalten hat.
	isHurt() {
		let timepassed = new Date().getTime() - this.lastHit;
		timepassed = timepassed / 1000;
		return timepassed < 0.5;
	}

	// Prüft, ob die Energie vollständig verbraucht ist.
	isDead() {
		return this.energy == 0;
	}

	// Wechselt das angezeigte Bild innerhalb einer Animationssequenz.
	playAnimation(images) {
		let intervall = this.currentImage % images.length;
		let path = images[intervall];
		this.img = this.imageCache[path];
		this.currentImage++;
	}

	// Bewegt das Objekt nach rechts mit der aktuellen Geschwindigkeit.
	moveRight() {
		console.log('Moving right');
		this.x += this.speed;
	}
	// Bewegt das Objekt nach links mit der aktuellen Geschwindigkeit.
	moveLeft() {
		this.x -= this.speed;
	}
}

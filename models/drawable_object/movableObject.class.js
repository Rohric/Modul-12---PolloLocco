/**
 * Extends drawable entities with physics, movement and health handling.
 */
class MovableObject extends DrawableObject {
	speed = 0.15;

	speedY = 0;
	acceleration = 2.5;

	energy = 100;
	lastHit = 0;

	otherDirection = false;

	/**
	 * Applies gravity to the object by updating vertical speed and position.
	 */
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

	/**
	 * Checks whether the object is currently above the ground plane.
	 * @returns {boolean} True if the object should keep falling.
	 */
	isAboveGround() {
		if (this instanceof ThrowablaObject) {
			return true;
		}
		if (this instanceof Character) {
			return this.y < this.groundLevel;
		}
		return this.y < 180;
	}

	/**
	 * Determines whether this object collides with another movable entity.
	 * @param {MovableObject|DrawableObject} other - Object to test against.
	 * @returns {boolean} True if the hitboxes overlap.
	 */
	isColliding(other) {
		const a = this.boundsWithOffset();
		const b = other.boundsWithOffset();
		return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
	}

	/**
	 * Reduces the energy value to simulate incoming damage.
	 */
	hit() {
		this.energy -= 5;
		if (this.energy < 0) {
			this.energy = 0;
		} else {
			this.lastHit = new Date().getTime();
		}
	}

	/**
	 * Checks if the object has been hurt recently.
	 * @returns {boolean} True if the last hit happened within half a second.
	 */
	isHurt() {
		let timepassed = new Date().getTime() - this.lastHit;
		timepassed = timepassed / 1000;
		return timepassed < 0.5;
	}

	/**
	 * Indicates whether the object has no remaining energy.
	 * @returns {boolean} True if the entity is dead.
	 */
	isDead() {
		return this.energy == 0;
	}

	/**
	 * Switches to the next frame in an animation sequence.
	 * @param {string[]} images - Ordered list of frame paths.
	 */
	playAnimation(images) {
		let intervall = this.currentImage % images.length;
		let path = images[intervall];
		this.img = this.imageCache[path];
		this.currentImage++;
	}

	/**
	 * Moves the object to the right based on its current speed value.
	 */
	moveRight() {
		// console.log('Moving right');
		this.x += this.speed;
	}

	/**
	 * Moves the object to the left based on its current speed value.
	 */
	moveLeft() {
		this.x -= this.speed;
	}
}

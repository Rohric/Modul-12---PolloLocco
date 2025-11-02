/**
 * Throwable salsa bottle that arcs forward and damages enemies.
 */
class ThrowablaObject extends MovableObject {
	/**
	 * Creates a new bottle at the given location and starts its flight.
	 * @param {number} x - Initial x coordinate.
	 * @param {number} y - Initial y coordinate.
	 * @param {number} direction - Horizontal direction (1 or -1).
	 */
	constructor(x, y, direction) {
		super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
		this.x = x;
		this.y = y;
		this.height = 60;
		this.width = 50;
		this.direction = direction;
		this.throw();
	}

	/**
	 * Applies an initial impulse and moves the bottle horizontally.
	 */
	throw() {
		this.speedY = 30;
		this.applyGravity();
		setInterval(() => {
			this.x += 10 * this.direction;
		}, 20);
	}
}

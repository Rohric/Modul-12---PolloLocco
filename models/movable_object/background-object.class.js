/**
 * Static background tile that fills the parallax scenery.
 */
class BackgroundObject extends MovableObject {
	width = 720;
	height = 480;

	/**
	 * Places a background image at a fixed level position.
	 * @param {string} imagePath - Path to the background sprite.
	 * @param {number} x - Horizontal placement.
	 * @param {number} [y] - Optional vertical placement.
	 */
	constructor(imagePath, x, y) {
		super().loadImage(imagePath);
		this.x = x;
		this.y = y ?? 480 - this.height;
	}
}

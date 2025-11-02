/**
 * Generic status bar that swaps images based on a percentage value.
 */
class StatusBar extends DrawableObject {
	images = [];
	percentage = 0;

	/**
	 * Creates a status bar and loads its image set.
	 * @param {Object} [config] - Configuration options.
	 * @param {string[]} [config.images] - Frame images in ascending order.
	 * @param {number} [config.x] - Horizontal canvas position.
	 * @param {number} [config.y] - Vertical canvas position.
	 * @param {number} [config.width] - Render width.
	 * @param {number} [config.height] - Render height.
	 * @param {number} [config.percentage] - Initial fill level.
	 */
	constructor({ images = [], x = 10, y = 0, width = 200, height = 60, percentage = 0 } = {}) {
		super();
		this.images = images;
		this.loadImages(this.images);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.setPercentage(percentage);
	}

	/**
	 * Updates the status value and swaps to the matching image.
	 * @param {number} percentage - New fill level between 0 and 100.
	 */
	setPercentage(percentage) {
		this.percentage = Math.max(0, Math.min(percentage, 100));
		const path = this.images[this.resolveImageIndex()];
		if (path) {
			this.img = this.imageCache[path];
		}
	}

	/**
	 * Chooses the correct image index based on the fill percentage.
	 * @returns {number} Index into the image list.
	 */
	resolveImageIndex() {
		if (this.percentage >= 100) {
			return 5;
		}
		if (this.percentage > 80) {
			return 4;
		}
		if (this.percentage > 60) {
			return 3;
		}
		if (this.percentage > 40) {
			return 2;
		}
		if (this.percentage > 20) {
			return 1;
		}
		return 0;
	}
}

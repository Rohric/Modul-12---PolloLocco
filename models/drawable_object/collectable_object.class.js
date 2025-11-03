/**
 * Base class for coins, bottles and other collectible items.
 */
class CollectableObject extends DrawableObject {
	width = 80;
	height = 80;
	y = 380;
	collected = false;

	/**
	 * Places the item at a random location and loads its sprite.
	 * @param {string} imagePath - Relative path to the collectible image.
	 */
	constructor(imagePath) {
		super();
		this.setRandomPosition();
		this.loadImage(imagePath);
	}

	/**
	 * Assigns a random X position within the level width.
	 */
	setRandomPosition() {
		this.x = Math.random() * (719 * 3) + 120;
	}

	/**
	 * Checks whether the character interacts with the item.
	 * @param {Character} character - Player character.
	 * @returns {boolean} True if the collectible was picked up.
	 */
	isCollect(character) {
		if (this.collected) {
			return false;
		}
		if (character.isColliding(this)) {
			this.collected = true;
			return true;
		}
		return false;
	}
}

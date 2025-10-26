class CollectableObject extends DrawableObject {
	width = 80;
	height = 80;
	y = 380;
	collected = false;

	constructor(imagePath) {
		super();
		this.setRandomPosition();
		this.loadImage(imagePath);
	}

	setRandomPosition() {
		this.x = Math.random() * 500 + 120;
	}
	
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

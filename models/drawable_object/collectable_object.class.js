class CollectableObject extends DrawableObject {
	width = 80;
	height = 80;
	y = 380;

	constructor(imagePath) {
		super();
		this.setRandomPosition();
		this.loadImage(imagePath);
	}

	setRandomPosition() {
		this.x = Math.random() * 500 + 120;
	}
}

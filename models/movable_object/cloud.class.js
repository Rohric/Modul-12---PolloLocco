class Cloud extends MovableObject {
	y = 50;
	width = 500;
	height = 250;
	// Wählt zufällige Startposition und Bild für eine Wolke.
	constructor() {
		super().loadImage('img/5_background/layers/4_clouds/1.png');

		this.x = Math.random() * 500;
		this.animate();
	}

	// Lässt die Wolke kontinuierlich nach links gleiten.
	animate() {
		setInterval(() => {
			this.moveLeft();
		}, 1000 / 60);
	}
}

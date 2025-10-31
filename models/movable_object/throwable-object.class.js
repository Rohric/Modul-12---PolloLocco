class ThrowablaObject extends MovableObject {
	// Erstellt eine neue Flasche an einer Startposition und merkt sich die Flugrichtung.
	constructor(x, y, direction) {
		super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
		this.x = x;
		this.y = y;
		this.height = 60;
		this.width = 50;
		this.direction = direction;
		this.throw();
	}

	// Lässt die Flasche nach vorn fliegen und simuliert dabei die Schwerkraft.
	throw() {
		this.speedY = 30;
		this.applyGravity();
		setInterval(() => {
			this.x += 10 * this.direction;
		}, 20);
	}
}

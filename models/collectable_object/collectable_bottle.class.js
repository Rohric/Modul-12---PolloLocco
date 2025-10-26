class Collectable_Bottle extends CollectableObject {
	y = 370;
	height = 60;
	width = 80;

	constructor() {
		const images = [
			'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
			'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
		];
		const randomImage = images[Math.floor(Math.random() * images.length)];
		super(randomImage);
		// Hier wählen wir zufällig eines der beiden Flaschenbilder
	}
}
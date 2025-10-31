class CollectableObject extends DrawableObject {
	width = 80;
	height = 80;
	y = 380;
	collected = false;

	// Setzt das Sammelobjekt zufällig in der Welt und lädt sein Bild.
	constructor(imagePath) {
		super();
		this.setRandomPosition();
		this.loadImage(imagePath);
	}

	// Wählt eine neue zufällige X-Position innerhalb des Levels.
	setRandomPosition() {
		this.x = Math.random() * (719*3) + 120;
	}
	
	// Prüft, ob der Spieler das Objekt berührt und markiert es als eingesammelt.
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

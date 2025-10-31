class Level {
	enemies;
	clouds;
	collectableCoin;
	collectableBottle;
	backgroundObjects;
	level_end_x = 719 * 3;

	// Speichert alle Objekte eines Levels, damit die Welt darauf zugreifen kann.
	constructor(enemies, clouds, collectableCoin, collectableBottle, backgroundObjects) {
		this.enemies = enemies;
		this.clouds = clouds;
		this.collectableCoin = collectableCoin;
		this.collectableBottle = collectableBottle;
		this.backgroundObjects = backgroundObjects;
	}
}

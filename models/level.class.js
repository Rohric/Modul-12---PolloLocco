/**
 * Container that groups all objects required to render a level.
 */
class Level {
	enemies;
	clouds;
	collectableCoin;
	collectableBottle;
	backgroundObjects;
	level_end_x = 719 * 3;

	/**
	 * Stores the lists for enemies, background and collectibles.
	 * @param {MovableObject[]} enemies - All enemy instances.
	 * @param {MovableObject[]} clouds - Cloud instances for the parallax layer.
	 * @param {CollectableObject[]} collectableCoin - Coins available in the level.
	 * @param {CollectableObject[]} collectableBottle - Bottles available in the level.
	 * @param {DrawableObject[]} backgroundObjects - Background tiles in render order.
	 */
	constructor(enemies, clouds, collectableCoin, collectableBottle, backgroundObjects) {
		this.enemies = enemies;
		this.clouds = clouds;
		this.collectableCoin = collectableCoin;
		this.collectableBottle = collectableBottle;
		this.backgroundObjects = backgroundObjects;
	}
}

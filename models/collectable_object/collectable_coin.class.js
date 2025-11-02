/**
 * Collectible coin that increases the player's coin counter.
 */
class Collectable_Coin extends CollectableObject {
	/**
	 * Creates a new coin with the default sprite and size.
	 */
	constructor() {
		super('img/8_coin/coin_1.png');
		this.width = 60;
		this.height = 60;
	}
}

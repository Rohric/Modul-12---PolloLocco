/**
 * Shows how many coins the player has collected.
 */
class StatusBar_Coin extends StatusBar {
	/**
	 * Creates the green coin bar positioned beneath the bottle bar.
	 */
	constructor() {
		super({
			images: [
				'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
				'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
				'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
				'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
				'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
				'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
			],
			x: 10,
			y: 100,
		});
	}
}

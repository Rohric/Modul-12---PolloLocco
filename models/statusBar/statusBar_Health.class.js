/**
 * Heads-up display bar showing the character's remaining health.
 */
class StatusBar_Health extends StatusBar {
	/**
	 * Creates the health bar with blue styling and full energy.
	 */
	constructor() {
		super({
			images: [
				'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
				'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
				'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
				'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
				'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
				'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
			],
			x: 10,
			y: 0,
			percentage: 100,
		});
	}
}

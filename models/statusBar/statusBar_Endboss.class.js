/**
 * Health bar for the endboss that slides into view during the encounter.
 */
class StatusBar_Endboss extends StatusBar {
	/**
	 * Creates the orange endboss bar starting off-screen.
	 */
	constructor() {
		super({
			images: [
				'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
				'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
				'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
				'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
				'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
				'img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
			],
			x: 820,
			y: 20,
			percentage: 100,
		});
	}
}

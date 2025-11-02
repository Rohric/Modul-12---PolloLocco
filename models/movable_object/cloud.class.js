/**
 * Decorative cloud that drifts across the sky.
 */
class Cloud extends MovableObject {
	y = 50;
	width = 500;
	height = 250;

	/**
	 * Picks a random start position and activates the drift animation.
	 */
	constructor() {
		super().loadImage('img/5_background/layers/4_clouds/1.png');

		this.x = Math.random() * (719 * 3) + 220;
		this.animate();
	}

	/**
	 * Moves the cloud slowly to the left in a loop.
	 */
	animate() {
		setInterval(() => {
			this.moveLeft();
		}, 1000 / 60);
	}
}

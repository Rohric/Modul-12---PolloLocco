let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();

audioManager.muteAll(true);
audioManager.playSound('background_drum');

/**
 * Starts a new game world and resets all runtime state.
 */
function init() {
	if (world) {
		world.destroy();
	}
	keyboard = new Keyboard();
	canvas = document.getElementById('canvas');
	level1 = createLevel();
	world = new World(canvas, keyboard, audioManager);
	updateAudioToggle(audioManager.isMuted);
	console.log('Start El Pollo Locco');
}

/**
 * Toggles the mute state and updates the UI button labels.
 * @param {HTMLButtonElement} button - Button that triggered the toggle.
 */
function toggleAudio(button) {
	button.blur();
	const targetMuted = !audioManager.isMuted;
	audioManager.muteAll(targetMuted);
	updateAudioToggle(targetMuted);
	if (!targetMuted) {
		audioManager.playSound('background_drum');
	}
}

/**
 * Updates both audio labels to reflect the current mute state.
 * @param {boolean} isMuted - True if audio is muted.
 */
function updateAudioToggle(isMuted) {
	document.getElementById('audioLabelOn').classList.toggle('d_none', isMuted);
	document.getElementById('audioLabelOff').classList.toggle('d_none', !isMuted);
}

/** Handles keyboard presses and updates the current input state. */
window.addEventListener('keydown', (event) => {
	if (event.keyCode === 82) {
		window.location.reload();
		return;
	}

	if (event.keyCode == 32) {
		keyboard.SPACE = true;
	}

	if (event.keyCode == 37) {
		keyboard.LEFT = true;
	}

	if (event.keyCode == 38) {
		keyboard.UP = true;
	}

	if (event.keyCode == 39) {
		keyboard.RIGHT = true;
	}

	if (event.keyCode == 40) {
		keyboard.DOWN = true;
	}

	if (event.keyCode == 68) {
		keyboard.D = true;
	}

	if (event.keyCode == 80) {
		keyboard.P = true;
		init();
		document.getElementById('overlayGameScreen').classList.add('d_none');
		document.getElementById('overlayGameScreenWON').classList.add('d_none');
		document.getElementById('overlayGameScreenLOST').classList.add('d_none');
		document.getElementById('canvas').classList.remove('d_none');
	}
});

/** Releases keyboard flags once the key is lifted. */
window.addEventListener('keyup', (event) => {
	if (event.keyCode == 32) {
		keyboard.SPACE = false;
	}

	if (event.keyCode == 37) {
		keyboard.LEFT = false;
	}

	if (event.keyCode == 38) {
		keyboard.UP = false;
	}

	if (event.keyCode == 39) {
		keyboard.RIGHT = false;
	}

	if (event.keyCode == 40) {
		keyboard.DOWN = false;
	}

	if (event.keyCode == 68) {
		keyboard.D = false;
	}

	if (event.keyCode == 80) {
		keyboard.P = false;
	}
});

/* ===== Responsive Area ===== */
/** Shows a rotate-warning overlay when the device is in portrait mode. */
document.addEventListener('DOMContentLoaded', () => {
	const warning = document.getElementById('orientationWarning');
	const toggleOrientationWarning = () =>
		warning.classList.toggle('show', window.matchMedia('(orientation: portrait)').matches);

	['resize', 'orientationchange'].forEach((eventName) => window.addEventListener(eventName, toggleOrientationWarning));
	toggleOrientationWarning();
});

let canvas;
let world;
let keyboard = new Keyboard();
const audioManager = new AudioManager();

let muteButtons = [];


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
	syncMuteButtons();
	if (!audioManager.isMuted) {
	}
	console.log('Start El Pollo Locco');
}

function setupAutoplayFallback() {
	const resumeAudio = () => {
		if (!audioManager.isMuted) {
			audioManager.playSound('background_drum');
		}
		window.removeEventListener('pointerdown', resumeAudio);
		window.removeEventListener('keydown', resumeAudio);
	};
	window.addEventListener('pointerdown', resumeAudio, { once: true });
	window.addEventListener('keydown', resumeAudio, { once: true });
}


/**
 * Keeps every mute toggle in sync with the current audio state.
 */
function syncMuteButtons() {
	const { isMuted } = audioManager;
	muteButtons.forEach((button) => {
		button.classList.toggle('muted', isMuted);
		button.setAttribute('aria-pressed', String(isMuted));
		const iconOn = button.querySelector('[data-audio-state="on"]');
		const iconOff = button.querySelector('[data-audio-state="off"]');
		if (iconOn && iconOff) {
			iconOn.classList.toggle('d_none', isMuted);
			iconOff.classList.toggle('d_none', !isMuted);
		}
	});
	const labelOn = document.getElementById('audioLabelOn');
	const labelOff = document.getElementById('audioLabelOff');
	labelOn?.classList.toggle('d_none', isMuted);
	labelOff?.classList.toggle('d_none', !isMuted);
}

/**
 * Handles a mute button click and resumes background music if needed.
 */
function handleMuteToggle() {
	audioManager.muteAll();
	syncMuteButtons();
	if (!audioManager.isMuted) {
		audioManager.playSound('background_drum');
	}
}

/**
 * Binds all elements with class "audio_toggle" to the audio manager.
 */
function setupMuteControls() {
	muteButtons = Array.from(document.querySelectorAll('.audio_toggle'));
	if (!muteButtons.length) {
		return;
	}
	syncMuteButtons();
	muteButtons.forEach((button) => {
		button.addEventListener('click', () => {
			button.blur();
			handleMuteToggle();
		});
	});
}

/**
 * Shows a rotate-warning overlay when the device is in portrait mode.
 */
function setupOrientationWarning() {
	const warning = document.getElementById('orientationWarning');
	if (!warning) {
		return;
	}
	const toggleOrientationWarning = () =>
		warning.classList.toggle('show', window.matchMedia('(orientation: portrait)').matches);
	['resize', 'orientationchange'].forEach((eventName) => window.addEventListener(eventName, toggleOrientationWarning));
	toggleOrientationWarning();
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

document.addEventListener('DOMContentLoaded', () => {
	setupMuteControls();
	setupOrientationWarning();
	setupAutoplayFallback();
});

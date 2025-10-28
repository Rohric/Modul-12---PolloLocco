let canvas;
let world;
let keyboard = new Keyboard();

function init() {
	canvas = canvas || document.getElementById('canvas');
	level1 = createLevel()
	world = new World(canvas, keyboard);
	console.log('Start El Pollo Locco');
}

window.addEventListener('keydown', (event) => {
	
	 if (event.keyCode === 82) {  // R
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
		document.getElementById('canvas').classList.remove('d_none');
	}
});

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
});
/* ===== Responsive Area ===== */
document.addEventListener('DOMContentLoaded', () => {
  const warning = document.getElementById('orientationWarning');
  const toggleOrientationWarning = () =>
    warning.classList.toggle('show', window.matchMedia('(orientation: portrait)').matches);

  ['resize', 'orientationchange'].forEach(eventName =>
    window.addEventListener(eventName, toggleOrientationWarning)
  );
  toggleOrientationWarning();
});

class MovableObject extends DrawableObject {
	x = 120;
	y = 250;
	img;
	height = 150;
	width = 100;

	moveRight() {
		console.log('Moving right');
	}

	moveLeft() {
		console.log('Moving right');
	}

    	loadImage(path) {
		this.img = new Image();
		this.img.src = path;
	}

}

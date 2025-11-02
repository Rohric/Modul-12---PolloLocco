class DrawableObject {
	img;
	imageCache = [];
	currentImage = 0;
	x = 120;
	y = 280;
	width = 100;
	height = 150;

	offset = { top: 0, right: 0, bottom: 0, left: 0 };

	// Lädt ein einzelnes Bild und weist es dem Objekt zu.
	loadImage(path) {
		this.img = new Image();
		this.img.src = path;
	}

	// Zeichnet das aktuelle Bild des Objekts auf das Canvas.
	draw(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}

	// Markiert die Kollisionsbox sichtbar, falls das Objekt relevant ist.
	drawFrame(ctx) {
		if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
			const { top, right, bottom, left } = this.offset;
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'red';
			ctx.rect(this.x + left, this.y + top, this.width - left - right, this.height - top - bottom);
			ctx.stroke();
		}
	}

	boundsWithOffset() {
		const { top, right, bottom, left } = this.offset;
		return {
			left: this.x + left,
			right: this.x + this.width - right,
			top: this.y + top,
			bottom: this.y + this.height - bottom,
		};
	}

	// Lädt mehrere Bilder in den Cache für Animationen.
	loadImages(arr) {
		arr.forEach((path) => {
			let img = new Image();
			img.src = path;
			this.imageCache[path] = img;
		});
	}
}

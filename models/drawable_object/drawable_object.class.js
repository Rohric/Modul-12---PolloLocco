/**
 * Base class for every drawable entity.
 * Handles image loading, rendering and hitbox helpers.
 */
class DrawableObject {
	img;
	imageCache = [];
	currentImage = 0;
	x = 120;
	y = 280;
	width = 100;
	height = 150;

	offset = { top: 0, right: 0, bottom: 0, left: 0 };

	/**
	 * Loads a single image and assigns it to the object.
	 * @param {string} path - Relative path to the image asset.
	 */
	loadImage(path) {
		this.img = new Image();
		this.img.src = path;
	}

	/**
	 * Draws the current image on the provided canvas context.
	 * @param {CanvasRenderingContext2D} ctx - Rendering context.
	 */
	draw(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}

	/**
	 * Draws the active hitbox rectangle (debug helper).
	 * @param {CanvasRenderingContext2D} ctx - Rendering context.
	 */
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

	/**
	 * Calculates the collision bounds considering the configured offsets.
	 * @returns {{left:number,right:number,top:number,bottom:number}} Adjusted bounds.
	 */
	boundsWithOffset() {
		const { top, right, bottom, left } = this.offset;
		return {
			left: this.x + left,
			right: this.x + this.width - right,
			top: this.y + top,
			bottom: this.y + this.height - bottom,
		};
	}

	/**
	 * Loads multiple images into the cache.
	 * @param {string[]} arr - Collection of image paths.
	 */
	loadImages(arr) {
		arr.forEach((path) => {
			let img = new Image();
			img.src = path;
			this.imageCache[path] = img;
		});
	}
}

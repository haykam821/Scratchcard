const SIZE = 256;
const CHANGE_INTERVAL = 10;

const CHANCE = 0.975;
const MAX_OPACITY = 10;

let savedPattern: CanvasPattern | null = null;
let lastPatternChange = 0;

function getAlpha(): number {
	return Math.random() > CHANCE ? Math.floor(Math.random() * MAX_OPACITY) : 0;
}

export function createNoisePattern(): CanvasPattern {
	if (savedPattern !== null && (lastPatternChange + CHANGE_INTERVAL) > Date.now()) {
		return savedPattern;
	}

	const canvas = new OffscreenCanvas(SIZE, SIZE);
	const context = canvas.getContext("2d");

	if (context === null) {
		throw new Error("Failed to create context");
	}

	const image = context.createImageData(SIZE, SIZE);

	for (let index = 3; index < SIZE * SIZE * 4; index += 4) {
		image.data[index] = getAlpha();
	}

	context.putImageData(image, 0, 0);

	const pattern = context.createPattern(canvas, null);

	if (pattern === null) {
		throw new Error("Failed to create context");
	}

	savedPattern = pattern;
	lastPatternChange = Date.now();

	return pattern;
}

export function clearSavedNoisePattern(): void {
	savedPattern = null;
	lastPatternChange = 0;
}

import { getColor } from "./utils/color";
import { canvas, contents, createButton, input, labelInput } from "./utils/elements";
import { applyMessage, HiddenMessage } from "./utils/message";
import { clearLastPos, Pos, updateLastPos } from "./utils/mouse";
import { applyMessageFromUrl, encodeMessage } from "./utils/parse";
import { clearSavedNoisePattern, createNoisePattern } from "./utils/pattern";

const CLEAR_RADIUS = 32;
const INTERPOLATE_STEPS = 16;

applyMessageFromUrl();

const context = canvas.getContext("2d");

function updateCanvas(reset: boolean): void {
	const size = contents.getBoundingClientRect();

	if (context === null || reset) {
		canvas.width = size.width;
		canvas.height = size.height;
	}

	if (context !== null) {
		if (reset) {
			context.fillStyle = getColor("layer");
			context.fillRect(0, 0, canvas.width, canvas.height);
		} else {
			const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
			const tempContext = offscreen.getContext("2d");

			if (tempContext !== null) {
				tempContext.drawImage(context.canvas, 0, 0);

				canvas.width = size.width;
				canvas.height = size.height;

				context.imageSmoothingEnabled = false;
				context.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
			}
		}
	}
}

window.addEventListener("resize", () => updateCanvas(false));
updateCanvas(true);

createButton.addEventListener("click", async () => {
	if (input.value) {
		const message: HiddenMessage = {
			label: labelInput.value ? labelInput.value : undefined,
			text: input.value,
		};

		location.hash = await encodeMessage(message);

		applyMessage(message);
		updateCanvas(true);
	}
});

function scratch([x, y]: Pos, [lastX, lastY]: Pos): void {
	if (context !== null) {
		context.save();

		context.lineWidth = CLEAR_RADIUS;

		context.fillStyle = createNoisePattern();
		context.globalCompositeOperation = "destination-out";

		const steps = (x === lastX && y === lastY) ? 1 : INTERPOLATE_STEPS;

		for (let step = 0; step <= steps; step += 1) {
			const progress = step / steps;

			const stepX = lastX + (x - lastX) * progress;
			const stepY = lastY + (y - lastY) * progress;

			context.beginPath();
			context.arc(stepX, stepY, CLEAR_RADIUS / 2, 0, Math.PI * 2);
			context.fill();
		}

		context.restore();
	}
}

document.body.addEventListener("mousemove", event => {
	updateLastPos(canvas, event, scratch);
});

document.body.addEventListener("mouseup", () => {
	clearLastPos();
	clearSavedNoisePattern();
});

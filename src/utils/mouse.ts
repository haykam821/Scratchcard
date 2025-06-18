export type Pos = Readonly<[number, number]>;
type Callback = (pos: Pos, lastPos: Pos) => void;

let lastPos: Pos | null = null;

export function getMousePos(canvas: HTMLCanvasElement, event: MouseEvent): Pos {
	const rect = canvas.getBoundingClientRect();

	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	const x = Math.floor((event.clientX - rect.left) * scaleX);
	const y = Math.floor((event.clientY - rect.top) * scaleY);

	return [x, y];
}

export function clearLastPos(): void {
	lastPos = null;
}

export function updateLastPos(canvas: HTMLCanvasElement, event: MouseEvent, callback: Callback) {
	if (event.buttons & 0x1) {
		const pos = getMousePos(canvas, event);

		if (lastPos !== null) {
			callback?.(pos, lastPos);
		}

		lastPos = pos;
	}
}

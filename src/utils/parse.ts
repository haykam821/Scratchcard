import { HiddenMessage, applyMessage, normalizeMessage } from "./message";

import { editor } from "./elements";

export async function parseMessage(hash: string): Promise<HiddenMessage | null> {
	hash = hash.trim();

	if (hash.startsWith("#")) {
		hash = hash.slice(1);
	}

	if (hash) {
		try {
			const decoded = atob(hash);
			const codePoints = new Uint8Array(decoded.length);

			for (let index = 0; index < decoded.length; index += 1) {
				codePoints[index] = decoded.codePointAt(index) ?? 0;
			}

			const stream: ReadableStream<Uint8Array> = new Blob([codePoints])
				.stream()
				.pipeThrough(new DecompressionStream("deflate"));

			const json = await new Response(stream).text();
			const message = JSON.parse(json) as HiddenMessage;

			if (message && typeof message === "object" && typeof message.text === "string") {
				return normalizeMessage(message);
			}
		} catch {
			// Ignore
		}
	}

	return null;
}

export async function encodeMessage(message: HiddenMessage): Promise<string> {
	const json = JSON.stringify(normalizeMessage(message));

	const stream: ReadableStream<Uint8Array> = new Blob([
		json,
	])
		.stream()
		.pipeThrough(new CompressionStream("deflate"));

	let hash = "";
	const reader = stream.getReader();

	let terminate = false;

	while (!terminate) {
		const { done, value } = await reader.read();

		if (done || value == undefined) {
			terminate = true;
		} else {
			hash += String.fromCodePoint(...value);
		}
	}

	return "#" + btoa(hash);
}

export async function applyMessageFromUrl(): Promise<void> {
	const message = await parseMessage(location.hash);

	if (message === null) {
		editor.classList.remove("hidden");
	} else {
		applyMessage(message);
	}
}

import { label, text } from "./elements";

export interface HiddenMessage {
	label?: string;
	text: string;
}

export function normalizeMessage(message: HiddenMessage): HiddenMessage {
	return {
		label: message.label?.trim(),
		text: message.text.trim(),
	};
}

export function applyMessage(message: HiddenMessage): void {
	text.textContent = message.text;
	label.textContent = message.label ? message.label : "\u00A0";
}

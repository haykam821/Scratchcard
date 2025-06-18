export function getColor(name: string): string {
	const value = getComputedStyle(document.body).getPropertyValue(`--${name}-color`);

	if (value === "") {
		throw new Error(`Missing color for ${name}`);
	}

	return value;
}

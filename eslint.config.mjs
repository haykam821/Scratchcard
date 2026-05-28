import { includeIgnoreFile } from "@eslint/compat";
import config from "eslint-config-haykam";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default [
	includeIgnoreFile(gitignorePath),
	...config,
];

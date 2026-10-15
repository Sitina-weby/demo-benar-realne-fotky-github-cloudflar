// Sestaví statický náhled redesignu do .jarvis-preview/ (index.html = /redesign/).
import { cpSync, rmSync, readFileSync, writeFileSync } from "node:fs";

rmSync(".jarvis-preview", { recursive: true, force: true });
cpSync("dist", ".jarvis-preview", { recursive: true });
const html = readFileSync("dist/redesign/index.html", "utf8").replaceAll('"../', '"./');
writeFileSync(".jarvis-preview/index.html", html);

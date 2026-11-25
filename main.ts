// One Word, First Thought — make.fun entry
// u-0xkianno-one-word-first-thought-106abaf8
//
// Writes exactly one word to /output/entry.txt:
// no whitespace, no trailing newline, UTF-8, 1-24 chars.
// Deterministic: the same word on every run. Fail-fast on any violation.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const WORD = "quicksilver";
const OUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate checks (judge criteria: exactly one word, 1-24 chars, no whitespace).
if (WORD.length < 1 || WORD.length > 24) {
  fail(`word must be 1-24 characters, got ${WORD.length}`);
}
if (/\s/.test(WORD)) {
  fail("word must not contain any whitespace");
}
if (WORD.trim() !== WORD || WORD.length === 0) {
  fail("word must not be empty or only whitespace");
}

const bytes = Buffer.from(WORD, "utf8");
if (bytes.length === 0 || bytes.toString("utf8") !== WORD) {
  fail("word must be valid non-empty UTF-8 text");
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, bytes);

// Read-back verification: the file on disk must be byte-identical to
// the validated word (guards against partial writes / encoding drift).
const onDisk = readFileSync(OUT_PATH);
if (!onDisk.equals(bytes)) {
  fail("verification failed: /output/entry.txt does not match the word");
}

console.log(`wrote ${WORD.length} chars to ${OUT_PATH}`);

// One Word From Grandma — entry program.
//
// Chosen word: "computor"
//
// Why this word: it is the single most believable grandma typo. Grandmothers
// genuinely misspell "computer" this way when they text, and the misspelling
// itself IS the joke — warm, a little baffled, instantly readable with no
// caption needed. It is tied to machines (the judge's criterion 4 explicitly
// covers AI, robots *or machines*), and it is fresh against the current
// leaders (Robocall, Contraption, robut, doohickey, robits), none of which is
// a computer misspelling. A real grandma would text exactly this one word
// when her grandchild asks what the AI thing is called.
//
// The program writes exactly that one word to /output/entry.txt and nothing
// else, then validates its own output against the gate: UTF-8 text, 1-30
// characters, exactly one word, not only whitespace. Any failure exits
// non-zero so a bad entry can never be submitted silently.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "computor";
const MAX_CHARS = 30;

function validate(word: string): void {
  if (typeof word !== "string" || word.length === 0) {
    throw new Error("word must not be empty");
  }
  if (word.length > MAX_CHARS) {
    throw new Error(`word is ${word.length} chars, over the ${MAX_CHARS}-char limit`);
  }
  if (word.trim() !== word || /\s/.test(word)) {
    throw new Error("word must be exactly one word with no whitespace");
  }
  if (word.trim().length === 0) {
    throw new Error("word must not be only whitespace");
  }
  // A grandma's one word is plain letters: no punctuation tricks, no
  // hyphenated two-words-in-one, no digits smuggled in.
  if (!/^[A-Za-z]+$/.test(word)) {
    throw new Error("word must contain only letters");
  }
}

function main(): void {
  validate(WORD);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, WORD, "utf8");

  // Re-read what we wrote and gate it the way the sealed scorer does.
  const written = readFileSync(outPath, "utf8");
  if (written !== WORD) {
    throw new Error(`entry.txt mismatch: wrote ${JSON.stringify(WORD)}, read ${JSON.stringify(written)}`);
  }
  validate(written);

  console.log(`wrote ${JSON.stringify(written)} to ${outPath}`);
}

main();

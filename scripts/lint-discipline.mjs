// The front page promises no model versions, no prices, no context sizes, no benchmarks.
// This is what turns that from a good intention into a rule: it runs on every pull
// request, including mine.
//
// The failure mode it prevents is specific and slow. Nobody adds a price table in one
// commit — someone adds one helpful parenthetical, then another, and eighteen months
// later the repo is the thing it was written to replace.

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const RULES = [
  {
    label: "model version or name",
    pattern: /\b(gpt-[0-9]|claude-[0-9]|opus [0-9]|sonnet [0-9]|haiku [0-9]|gemini [0-9]\.[0-9]|grok-[0-9]|kimi-k[0-9])\b/gi,
    why: "model names change every few months; the shape of the tool does not",
  },
  {
    label: "price",
    pattern: /\$\d|\b\d+\s?(usd|eur)\b|\/month\b|per month\b|\bfree tier\b/gi,
    why: "pricing is the vendor's to state, and it changes without warning",
  },
  {
    label: "context window size",
    pattern: /\b\d+\s?[km]\s?(tokens|context)\b|\b(128k|200k|1m)\s*(tokens|context)?\b/gi,
    why: "a number that will be wrong within weeks; describe when large context helps instead",
  },
  {
    label: "benchmark",
    // Named benchmarks and scores only. Plain "leaderboard" is deliberately absent: these
    // pages argue AGAINST trusting one, and a rule that forbids naming the thing you are
    // criticising makes the writing worse rather than the repo more honest.
    pattern: /\b(swe-?bench|humaneval|mmlu|aider polyglot)\b|\b\d{1,3}%\s+on\b|\branked #?\d/gi,
    why: "benchmarks measure standardised puzzles, not your codebase",
  },
  {
    label: "rate limit",
    pattern: /\b\d+\s+(requests?|messages?|prompts?)\s+per\s+(hour|day|minute)\b/gi,
    why: "limits are the vendor's to state and they move",
  },
];

// news.md is written by scripts/watch.mjs and quotes vendor headlines verbatim. It is the
// one file where a machine puts dates and product names on the page, which is exactly why
// it is trusted: no human is maintaining a claim there.
const EXEMPT = new Set(["news.md"]);

async function markdownFiles() {
  const out = [];
  for (const dir of [".", "tools"]) {
    for (const name of await readdir(join(ROOT, dir))) {
      if (!name.endsWith(".md")) continue;
      const rel = dir === "." ? name : `${dir}/${name}`;
      if (!EXEMPT.has(name)) out.push(rel);
    }
  }
  return out;
}

const files = await markdownFiles();
const violations = [];

for (const file of files) {
  const text = await readFile(join(ROOT, file), "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    // A rule may be quoted while being explained — the README and CONTRIBUTING both list
    // what is banned, and must be allowed to say so.
    if (/^\s*[-*|]?\s*(model versions?|prices?|context[- ]window sizes?|benchmark|rate limits?)\b/i.test(line)) return;
    for (const rule of RULES) {
      for (const m of line.matchAll(rule.pattern)) {
        violations.push({ file, line: i + 1, text: m[0], label: rule.label, why: rule.why });
      }
    }
  });
}

if (violations.length === 0) {
  console.log(`${files.length} pages checked — the repo keeps its own promise`);
  process.exit(0);
}

console.error(`${violations.length} thing(s) this repo promises not to contain:\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.label} — ${JSON.stringify(v.text)}`);
  console.error(`    ${v.why}\n`);
}
console.error("If a page genuinely needs one of these, the rule is wrong and should be");
console.error("changed deliberately in README.md and CONTRIBUTING.md — not worked around.");
process.exit(1);

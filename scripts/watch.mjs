// The thing that keeps this repo honest.
//
// A comparison does not become wrong with a bang. The vendor ships something, the page
// keeps saying the old thing, and nobody notices for a year. So: every link is fetched,
// every vendor's own feed is read, and news.md is rewritten from what came back. Nothing
// here depends on someone remembering to check.
//
// Node's standard library only — no install step, nothing to keep up to date, and the
// script itself cannot rot from under us.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

// A vendor is watched through the feed it publishes itself. HTML scraping is deliberately
// avoided: it breaks on redesigns, and a watcher that cries wolf gets muted, which is
// worse than no watcher at all. A vendor with no usable feed is listed as unwatched
// rather than guessed at.
const VENDORS = [
  // Anthropic publishes no feed (verified: /rss.xml is a 404), so this one is read from
  // the news index as HTML. That is fragile by nature — a redesign breaks it — so a parse
  // failure is reported as "could not check", never as an alarm.
  { tool: "Claude Code", html: "https://www.anthropic.com/news", site: "https://claude.com/product/claude-code" },
  { tool: "Codex", feed: "https://openai.com/news/rss.xml", site: "https://openai.com/codex/" },
  { tool: "Gemini CLI", feed: "https://blog.google/technology/google-deepmind/rss/", site: "https://google-gemini.github.io/gemini-cli/" },
  { tool: "Cursor", feed: "https://cursor.com/changelog/rss.xml", site: "https://cursor.com/changelog" },
  { tool: "Grok", feed: null, site: "https://x.ai/news" },
  { tool: "Kimi", feed: null, site: "https://www.moonshot.ai" },
];

const UA = "agents-compared-watcher (+https://github.com/xpressmike/agents-compared)";

async function fetchText(url, timeoutMs = 20000) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "*/*" },
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "follow",
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.text();
}

// Which HTTP statuses actually mean "this link is broken".
//
// Not 403. Several vendors here (openai.com, x.ai) answer 403 to anything that looks
// automated — verified: a full browser User-Agent from this machine gets 403 too, so it
// is datacentre-level bot protection, not a missing page. Treating that as a dead link
// would file the same false report every week until someone muted the job, which is how
// a watcher stops being read. Only a page the server says is gone counts as gone.
const GONE = new Set([404, 410]);
const isGone = (err) => GONE.has(err?.status);

/** Newest posts from an HTML index: the first few article links on the page. Deliberately
 *  shallow — it extracts a title and a URL and nothing else, so there is less to break. */
function parseHtmlIndex(html, base, limit = 3) {
  const seen = new Set();
  const out = [];
  for (const m of html.matchAll(/<a[^>]+href="([^"]*\/news\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = new URL(m[1], base).href;
    const inner = m[2];
    // A card's <a> wraps the heading, the category, the date and the teaser. Flattening
    // all of it gives "Introducing X Product Jul 24 2026 X is a…" — so prefer the heading
    // element when the markup has one, and only fall back to flattened text.
    const heading = inner.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i)?.[1] ?? inner;
    const title = heading.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 110);
    if (!title || title.length < 8 || seen.has(url)) continue;
    seen.add(url);
    out.push({ title, url, date: null });
    if (out.length >= limit) break;
  }
  return out;
}

/** Newest entries from an RSS or Atom feed. Both shapes, one shallow parser: a feed is
 *  the one input here we do not control, so it must never throw. */
function parseFeed(xml, limit = 3) {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/g) ?? [];
  return blocks.slice(0, limit).map((block) => {
    const pick = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim() : "";
    };
    const href = block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? pick("link");
    const date = pick("pubDate") || pick("updated") || pick("published");
    return { title: pick("title"), url: href, date: date ? new Date(date) : null };
  }).filter((e) => e.title);
}

/** Every http(s) link in the repo's markdown, with the file it came from. */
async function collectLinks() {
  const files = [];
  for (const dir of [".", "tools"]) {
    for (const name of await readdir(join(ROOT, dir))) {
      if (name.endsWith(".md")) files.push(join(dir, name).replace(/^\.\//, ""));
    }
  }
  const links = new Map();
  for (const file of files) {
    const text = await readFile(join(ROOT, file), "utf8");
    for (const m of text.matchAll(/<(https?:\/\/[^>\s)]+)>|\]\((https?:\/\/[^)\s]+)\)/g)) {
      const url = (m[1] ?? m[2]).replace(/[.,]$/, "");
      if (!links.has(url)) links.set(url, new Set());
      links.get(url).add(file);
    }
  }
  return links;
}

async function main() {
  const problems = [];
  const unchecked = [];

  // 1. Every link we point a reader at must still resolve. A dead vendor link is the
  //    most common way a page like this goes stale in public.
  const links = await collectLinks();
  console.log(`checking ${links.size} outbound links`);
  for (const [url, files] of links) {
    try {
      await fetchText(url, 25000);
    } catch (err) {
      // One retry: a single timeout is not a dead page, and a false alarm costs more
      // credibility than a day's delay.
      try {
        await new Promise((r) => setTimeout(r, 3000));
        await fetchText(url, 25000);
      } catch (err2) {
        if (isGone(err2)) {
          problems.push(`- [ ] \`${url}\` → ${err2.message} (linked from ${[...files].join(", ")})`);
          console.log(`  GONE ${url} — ${err2.message}`);
        } else {
          unchecked.push(`${url} (${err2.message})`);
          console.log(`  skip ${url} — ${err2.message}, not treated as broken`);
        }
      }
    }
  }

  // 2. What each vendor said most recently. This is the only place dates are allowed in
  //    this repo, precisely because nobody types them.
  const rows = [];
  const announcements = [];
  for (const vendor of VENDORS) {
    if (!vendor.feed && !vendor.html) {
      rows.push(`| ${vendor.tool} | — | not watched (no public feed) | [site](${vendor.site}) |`);
      continue;
    }
    try {
      const source = vendor.feed ?? vendor.html;
      const text = await fetchText(source);
      const entries = vendor.feed ? parseFeed(text) : parseHtmlIndex(text, source);
      const latest = entries[0];
      if (!latest) {
        rows.push(`| ${vendor.tool} | — | feed returned nothing | [site](${vendor.site}) |`);
        continue;
      }
      const day = latest.date && !Number.isNaN(+latest.date) ? latest.date.toISOString().slice(0, 10) : "—";
      rows.push(`| ${vendor.tool} | ${day} | [${latest.title}](${latest.url}) | [site](${vendor.site}) |`);
      // Only recent news is worth a human's attention; older entries are just history.
      if (latest.date && Date.now() - +latest.date < 8 * 864e5) {
        announcements.push(`- **${vendor.tool}** — [${latest.title}](${latest.url}) (${day})`);
      }
      console.log(`  ${vendor.tool}: ${day} — ${latest.title.slice(0, 60)}`);
    } catch (err) {
      rows.push(`| ${vendor.tool} | — | source unreachable | [site](${vendor.site}) |`);
      // A vendor blocking our fetch is not a defect in this repo — report it as a note.
      const line = `${vendor.tool}: ${vendor.feed ?? vendor.html} → ${err.message}`;
      if (isGone(err)) problems.push(`- [ ] ${line} (the source itself is gone — find the new one)`);
      else unchecked.push(line);
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  await writeFile(
    join(ROOT, "news.md"),
    `# What each vendor said last

The only page here with dates on it, because it is the only page a machine writes. Every
other page describes the shape of a tool, which is the part that does not change weekly.

Regenerated by \`scripts/watch.mjs\` (weekly, and on demand). Last run: ${stamp}.

| Tool | Date | Latest announcement | Vendor |
|---|---|---|---|
${rows.join("\n")}

## What to do with this

If a line here contradicts what a tool's page in \`tools/\` claims about its *shape* —
where it runs, what it can reach, what workflow it pushes you toward — the page is wrong
and should be fixed. If it only announces a new model, a price change or a bigger context
window, the pages here are deliberately silent on all three and nothing needs to change.
`,
    "utf8",
  );
  console.log("news.md rewritten");

  // Written for the workflow to read: it decides whether to open an issue.
  await writeFile(
    join(ROOT, ".watch-report.md"),
    problems.length || announcements.length
      ? [
          problems.length ? `## Broken links and unreachable feeds\n\n${problems.join("\n")}` : "",
          announcements.length
            ? `## Announced in the last week — check the affected pages still describe the tool correctly\n\n${announcements.join("\n")}`
            : "",
        ].filter(Boolean).join("\n\n")
      : "",
    "utf8",
  );

  if (unchecked.length) console.log(`\n${unchecked.length} could not be checked (bot protection or a timeout) — not reported as broken`);
  console.log(`${problems.length} problems, ${announcements.length} fresh announcements`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

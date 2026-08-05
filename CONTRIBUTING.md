# Contributing

Corrections are welcome — especially "this page describes my tool wrongly" from the people
who build these things. Open an issue or a pull request.

## What this repo takes

- **Factual corrections** about a tool's *shape*: where it runs, what it can reach, what
  workflow it pushes you toward, what transfers when you leave it.
- **A new tool page**, if the tool is a coding agent someone would genuinely be choosing
  between. Follow `tools/_template.md`: same four questions, same order.
- **Fixes to the automation** in `scripts/watch.mjs`.
- **Vendor links** that have moved.

## What it declines, on principle

A pull request adding any of these will be closed with a link to this section — not
because it is inaccurate, but because it is the category of thing that makes comparisons
wrong:

- model versions or names
- prices, plans, free-tier terms
- context-window sizes
- rate limits
- benchmark scores or leaderboard positions
- "as of <date>" claims about capability

Every one of them is true for a few weeks and then quietly false, and a page that is
partly false is worse than no page, because it looks maintained. They belong on the
vendor's own pages, which every tool page links at the bottom.

`news.md` is the single exception, and only because a machine writes it.

## The bar for a tool page

Describe the shape, not your preference. "Annoying" is a fine thing to write about — say
what will annoy a reasonable person about the *design*, not about a bug that will be fixed
next week.

If you have not used the tool on real work, say so in the pull request. A page written
from documentation is still useful; a page written from documentation and presented as
experience is not.

## Style

Plain English. No emoji. No hype. Assume the reader is deciding how to spend the next
month of their working life and does not need to be sold anything.

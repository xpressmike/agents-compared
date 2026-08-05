# Gemini CLI

**Shape:** terminal
**Made by:** Google

## What it is

Google's terminal agent, open source, pointed at a project folder like the others. It
competes on a specific axis: how much of your project it can consider at once.

## The workflow it pushes you toward

Whole-codebase reasoning rather than file-at-a-time reasoning. That pays off when a
problem is genuinely spread out — "why does this value end up wrong on the settings page"
can involve a form, a store, an API route and a database helper, four files that only make
sense together. It also helps with the unglamorous work: understanding a codebase you did
not write, finding every place a pattern is used, migrations that touch dozens of files
the same way.

For the ordinary small task — fix this function, add this field, rename this thing — the
capacity is not the point, because you were never going to use it.

## What transfers when you leave

The lesson that capacity is not attention. It is tempting to reason "more context, better
answers" and paste in everything; in practice a long undifferentiated dump can make things
worse, because the detail that mattered is now one line among thousands.

The skill — with every agent, not just this one — is choosing what goes in. Point at the
three files that matter, state the constraint, name what you already tried. If you find
yourself hoping the window is big enough, the request is probably too big.

Being open source, it is also the easiest of these to read when you want to know what an
agent actually does with your prompt. That understanding transfers to all of them.

## What will annoy you

Large context invites lazy prompting, and lazy prompting is punished at every size.

Google ships coding assistance under several names across cloud and editor products, and
working out which page applies to the thing you installed takes longer than it should.

## Where the numbers live

- <https://google-gemini.github.io/gemini-cli/>
- <https://github.com/google-gemini/gemini-cli>
- <https://ai.google.dev/pricing>

# Claude Code

**Shape:** terminal
**Made by:** Anthropic

## What it is

A coding agent you run in a shell, pointed at a project folder. It reads your files,
proposes changes, applies them, and runs commands — your tests, your linter, git. It also
ships as an extension for editors and as a desktop and web surface, but the terminal is
the shape everything else is arranged around.

## The workflow it pushes you toward

Conversation in the place where your tooling already lives. Because it can run commands,
the loop closes: it changes code, runs your test suite, reads the failure, and tries
again. That is qualitatively different from a tool that can only suggest text at you — the
agent finds out it was wrong before you do.

It leans on a project-instructions file you keep in the repo, which is where you teach it
your conventions once instead of re-explaining them every session. Treat that file as part
of the codebase and the agent gets consistent; ignore it and you will repeat yourself.

## What transfers when you leave

Almost everything. The habits — give context deliberately, ask for a plan before a large
change, read the diff, iterate in small steps — are the habits every agent in this
category rewards. So is the discipline of writing conventions down for the agent rather
than holding them in your head.

The commands you learn along the way are real terminal commands. They keep working
whatever you switch to, including nothing.

## What will annoy you

You are in a text interface. No file tree, no click-to-open. If the terminal is unfamiliar,
that friction arrives on top of learning the agent, and the two will feel like one problem
even though they are two.

An agent that can run commands is, unavoidably, an agent that can run the wrong command.
The mitigation is the one you would use with a competent new colleague who has had no
sleep: work on a branch, keep changes small enough to read, and do not approve what you
have not actually read. "Looks fine" is not reading.

## Where the numbers live

Models, limits and pricing move faster than this page intends to. Read them at the source,
where keeping them current is at least somebody's job:

- <https://claude.com/product/claude-code>
- <https://docs.claude.com/en/docs/claude-code/overview>
- <https://claude.com/pricing>

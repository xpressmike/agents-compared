# Codex

**Shape:** terminal + remote
**Made by:** OpenAI

## What it is

A coding agent with two ways in: a CLI you run against a local project folder, and a
hosted mode where you hand over a task and it works on its own machine, returning a branch
or a pull request. Same idea underneath, two very different feedback loops on top.

## The workflow it pushes you toward

The CLI pushes the same loop as any terminal agent: point it at a repo, talk to it, review
diffs, let it run commands.

The hosted mode pushes something else entirely — specification. There is no back and
forth to rescue a vague request, so the quality of what you get back is mostly decided
before the agent starts. It suits bounded, well-described work: a migration you can state
precisely, a chore across many files, a fix with a clear reproduction.

That mode is a poor first tool for a beginner, and for a specific reason: the moment-to-
moment feedback is exactly the part that teaches, and it is exactly the part removed.

## What transfers when you leave

From the CLI, the ordinary agent habits — context, plan, diff, iterate.

From the hosted mode, something rarer and more valuable: writing a task description
complete enough that someone who cannot ask you questions can do it. That is the same
skill as writing a good ticket, and it makes you better at working with people, not just
agents.

## What will annoy you

Two surfaces means two mental models, and it is not always obvious which one a piece of
advice was written for.

In hosted mode, the round trip is long enough that a misunderstanding is expensive: you
find out at the end. Reviewing an agent's pull request is also a genuine skill — it looks
like reviewing a colleague's work, but the failure modes are different, and confident
wrongness is more common than sloppiness.

## Where the numbers live

- <https://openai.com/codex/>
- <https://developers.openai.com/codex/>
- <https://openai.com/api/pricing/>

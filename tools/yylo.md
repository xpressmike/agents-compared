# YYLO

**Shape:** terminal
**Made by:** yylo-dev

## What it is

A command-line orchestrator for coding agents. You point it at a repository and a task,
and it runs the coding agent you choose for that task — Pi, Claude Code, Codex, Gemini
CLI — inside a dedicated branch and worktree, with typed task, validation and merge
boundaries around what the agent is allowed to do. Every run leaves a receipt: what ran,
what changed, and what was verified before it was allowed to land.

## The workflow it pushes you toward

Task-shaped work rather than conversation-shaped. Each task gets its own worktree, its own
agent, and a finish gate that verifies the committed result before anything is queued to
merge; the merge itself is native Git, and review happens at that boundary. Task state
lives in a ledger — Kanban and records kept as Markdown inside the repository — so "what
is the agent working on" is a file you can read, not a session you had to be present for.

The position it takes: coding agents are plentiful and get replaced often, but the
boundaries around them — worktrees, validation, merge discipline, records — are the part
worth keeping constant while the agent underneath changes.

## What transfers when you leave

Writing a task precisely enough that an agent can do it without asking you questions —
the same skill as writing a good ticket, and it survives every tool in this list. So does
the habit of one worktree per change, sized so it can be reviewed at a boundary. The
ledger, receipts and task state are Markdown and native Git: whatever you switch to can
read them, including a text editor and no agent at all.

## What will annoy you

It is a layer, not an agent. You still choose, install and pay for the coding agents it
orchestrates; the model conversations happen inside whichever agent you picked, and the
orchestrator's own vocabulary — tasks, worktrees, receipts, merge queues — sits on top of
that agent's vocabulary. Two mental models, same as any two-surface tool. There is also
ceremony: routing a two-line edit through task boundaries and verification feels like
filing a form to change a lightbulb. It is a young project, and the documentation assumes
you are already comfortable with Git internals.

## Where the numbers live

YYLO itself is open source and sells no seats and no models — the numbers that matter
belong to the coding agents it drives, on their vendors' own pages. For the orchestrator
itself:

- <https://github.com/yylo-dev/yylo>
- <https://www.yylo.dev>
- <https://www.npmjs.com/package/@yylo/cli>

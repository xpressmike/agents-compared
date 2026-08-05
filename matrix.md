# Same shape, different seat

Rows are **workflow properties** — things that change how your day goes. Not scores, not
capabilities that will be equalised by the next release, and not anything with a number in
it.

A property is only listed here if it is a *durable* consequence of the tool's shape. "Can
run your test suite" is durable: it follows from living in a terminal. "Handles large
refactors well" is not — that is a model claim, it changes monthly, and it belongs in
nobody's table.

| | Claude Code | Codex (CLI) | Codex (hosted) | Gemini CLI | Cursor | Grok / Kimi |
|---|---|---|---|---|---|---|
| **Where it runs** | your terminal | your terminal | vendor's machine | your terminal | your editor | depends on client |
| **Can run your tests** | yes | yes | yes, remotely | yes | it can suggest the command | depends on client |
| **Where diffs appear** | terminal | terminal | pull request | terminal | in the file, in place | depends on client |
| **Accept part of a change** | by asking | by asking | review the PR | by asking | per hunk, by clicking | depends on client |
| **Feedback loop** | seconds | seconds | one round trip | seconds | seconds | depends on client |
| **Needs the terminal** | yes | yes | no | yes | no | depends on client |
| **Project conventions file** | yes | yes | yes | yes | yes | depends on client |
| **Source available** | no | no | no | yes | no | partly (Kimi) |
| **You can change the model** | no | no | no | no | yes | that is the point |
| **Good first tool for a beginner** | yes | yes | no | yes | yes | only with a good client |

## How to read this

**"Depends on client"** is not a dodge. Grok and Kimi are model families, not agents; the
seat is chosen by whatever tool you drive them from, which is precisely why they are
listed separately from tools that ship both.

**"Good first tool"** is about the feedback loop, not about quality. Hosted mode gets a
"no" because it removes the moment-to-moment feedback that teaches you, not because it
does worse work.

**"It can suggest the command"** is the honest answer for an editor-bound agent. It knows
what should be run. It is not the thing running it and reading the output, and that gap is
the difference between "the change looks right" and "the change works".

## What is deliberately not here

Context window sizes, prices, model names, benchmark results, star counts, launch dates.
Every one of them would be wrong within weeks, and a table that is 30% wrong is worse than
no table, because it looks maintained.

The numbers live on each vendor's own pages, linked at the bottom of every tool page.

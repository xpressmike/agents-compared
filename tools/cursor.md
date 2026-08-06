# Cursor

**Shape:** editor
**Made by:** Anysphere

## What it is

An editor with the agent built in, rather than an agent with an editor bolted on. You see
the file, it edits the file, and changes appear in place with accept and reject controls.

## The workflow it pushes you toward

Reviewing changes where the code lives. For a subtle edit, seeing it surrounded by the
code it affects is genuinely better than reading a diff in a terminal — and accepting one
hunk while rejecting another is natural in an editor and awkward everywhere else.

If you already work in an editor, there is almost no new surface to learn. That is the
whole pitch, and it is a good one: the tool people keep using is the one that fits the
habits they already have.

## What transfers when you leave

The reviewing instinct — reading a proposed change critically, in context, and rejecting
part of it — is the most valuable habit in this whole category, and this shape teaches it
better than the others.

What transfers less well is the terminal fluency you never had to build. Moving from an
editor agent to a terminal one is a bigger step than the reverse, which is worth knowing
before you choose.

## What will annoy you

Reach. Running the test suite, checking out a branch, reading a log, deploying — all of
that lives in the terminal. An editor-bound agent will happily suggest the command; it is
just not the one running it, and not the one reading what came back. That gap is where
"the change looks right" stops short of "the change works", and the distance between those
two sentences is where the afternoon goes.

Composition, too: terminal agents chain with everything else in a terminal, which is the
entire reason terminals are still here.

## Where the numbers live

- <https://cursor.com>
- <https://docs.cursor.com>
- <https://cursor.com/pricing>

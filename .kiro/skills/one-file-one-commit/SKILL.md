---
name: one-file-one-commit
description: Commit each changed file as a separate git commit. Use when making multiple file changes that should be committed individually, or when asked to commit changes one file at a time.
---

## One file per commit

When committing changes, stage and commit each modified file separately rather than bundling all changes into one commit.

### Workflow

1. Run `git status` to list all modified, added, or deleted files.
2. For each file (one at a time):
   - Stage only that file: `git add <file>`
   - Write a commit message scoped to that file's change
   - Commit: `git commit -m "<message>"`
3. Repeat until all changed files have their own commit.
4. Run `git log --oneline -n <count>` to confirm one commit per file.

### Commit message format

Use a concise, imperative message describing what changed in that specific file:

- `feat(index): add SuperCode and Abyssal Oath to project spotlight`
- `fix(styles): correct button padding in styles.css`
- `chore: update .gitignore to exclude build artifacts`

### Rules

- Never use `git add .` or `git add -A` — always stage one file at a time.
- Never combine unrelated file changes into one commit, even if the changes are small.
- If a file deletion is intentional and standalone, commit it alone with a `chore: remove <file>` message.
- Asset files added alongside a feature change (e.g. a logo copied into assets/) should be committed together with the HTML change that references them, as a single logical unit.

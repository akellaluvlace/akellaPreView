# CLAUDE.md

Project: **Dropin** — Next.js + Vercel site where vibecoders paste AI-generated HTML/JSX and see it render live, or pick from a gallery of templates. Audience: people with no terminal, no Node install, no dev background.

## Pointers (open on demand)

- **Rolling status / next sub-chunk**: `~/.claude/projects/C--Users-nikit-akellaPreView/memory/project_manipulation_phase1_progress.md` — read the START HERE block first.
- **AST engines + helpers + per-engine bench list + Phase 2/5/master specs + template playbook**: `CLAUDE-archive.md` → "Pointer details".
- **Stack / preview-runtime / gotchas / template contract / acceptance criteria**: `CLAUDE-archive.md`.
- **Specs**: `plan.md` (build, locked) · `maniuplation.md` (master) · `phase5-tools-isolation.md` (Phase 5 + §5 Phase 6 ramps) · `phase2-manipulation.md` (reference).

## Rules (non-negotiable)

1. **No co-sign on commits.** No `Co-Authored-By: Claude` trailer or AI attribution. Commits attributed to `akellaluvlace <nikita.akella13@gmail.com>` only.
2. **Never push without explicit permission.** Local git ops fine. Any remote-affecting action (`git push`, `--force`, `gh pr create`, tag push, release) needs fresh per-push approval.
3. **Never deviate from the locked stack** (Next.js 14.2.x, Tailwind 3.4.x, Monaco, parse5, @babel/parser, magic-string). Locked-out list in archive.
4. **Debug by reading code.** No dev/prod servers, puppeteer, or test harnesses unless explicitly asked.
5. **Don't run `next build` to confirm.** `npx tsc --noEmit` and trust it. See `memory/feedback_no_npm_build_to_verify.md`.
6. **Surface unrelated breakage; don't fix it.** Documented trap memories are context, not standing permission.

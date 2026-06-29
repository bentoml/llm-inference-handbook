# Replay Modular branding onto current main (recover missing copy edits + new components)

Date: 2026-06-29
Branch: `modular-branding` (worktree: `/Users/billw/Developer/modular-repos/llm-inference-handbook/modular-branding`)
Route: tenacious-only (Grill Bill)

## Goal

Bring all of main's `6570eb5` (May 26) → `9cf5047` (June 23) work — doc copy edits, new
interactive components, new pages, calculator fixes — into the rebrand branch while keeping
the Modular branding, producing a building site that is verified visually via `annotate-ui`.

Success = clean `npm run build`; the previously-reverted copy edits present; the 3 restored
interactive components on-brand; user's annotate-ui pass clean.

## Refined problem statement

The `modular-branding` branch is NOT a normal feature branch. The rebrand commit `1f30c45`
was authored from an old checkout of main (true fork = `6570eb5`, May 26) and then committed
directly on top of `9cf5047`. Its tree therefore **records the deletion** of ~1 month of main:

- Doc copy edits (e.g. PR #148 vram doc, #147 GPU FAQ, #144 config note, #135 tokenizer
  example, #136 decoder FAQ) — reverted, in places reintroducing old "BentoML" brand text.
- New interactive components added after the fork: `TopPvsTopK` (May 28), `LLMLifecycleMap`
  (Jun 1), `LatencyTimelineVisualizer` (Jun 12) — absent on the branch (staleness, not intent).
- New page `inference-parameters.md` (May 28), calculator fix #131, model-list updates (#145 GLM-5.2, M3).

A normal `git rebase origin/main` is a NO-OP (branch already sits on `9cf5047`). The fix is a
content replay, not a rebase.

## Chosen approach

Forced-base 3-way merge: `base = 6570eb5`, `ours = branding HEAD`, `theirs = main 9cf5047`.
Validated non-destructively with `git merge-tree` (synthetic commit `tree=HEAD, parent=6570eb5`,
whose auto merge-base with `9cf5047` is exactly `6570eb5`). Result: most files auto-merge, the
3 new components return automatically (branding never deleted them), 8 real conflicts remain.

## Key facts / constraints

- Branch IS on origin (`origin/modular-branding` @ `e0588c8`), no local tracking. => Do NOT
  rewrite history / force-push. Land the fix as an additive commit on a new branch.
- Build: `npm run build` (docusaurus). Static serve for review: `npm run serve`. Avoid `npm start`
  (dev HMR) for annotate-ui.
- Color mode: `docusaurus.config.ts` -> `colorMode: { defaultMode: 'light', disableSwitch: true }`.
  Site is effectively light-only => annotate-ui `--modes=light` only.
- Brand palette (`dls/handbookTheme.scss`): neutrals `--Elements-Twilight-*` (`Twilight100 #020c13`
  .. `White #fff`); single indigo accent `--Elements-Neb-*` (`NebulaUltra #637bff`,
  `NebulaCompliant #4e57f3`, light tints `Neb-20..40`). No green; one accent.

## The 8 merge conflicts and resolutions

1. `.gitignore` — union: branding's structured ignores + main's `# Testing`/`testing/`, `.agents/log`, screenshots, playwright/test dirs, `.vscode`.
2. `docs/getting-started/choosing-the-right-inference-framework.md` — take main's copy; re-apply branding's only change: MAX link `utm_source=bentoml_llm` -> `llm_handbook`.
3. `docs/inference-optimization/index.mdx` — take main's new "Why do you need to optimize inference?" section + reworded intro; keep branding `<Newsletter>` -> `<ContactSection>` (import + usage).
4. `docs/llm-inference-basics/how-does-llm-inference-work.md` — keep main's interactive `<LatencyTimelineVisualizer />` (decision 4A) over branding's static `<Diagram name="llm-inference-itl" />`. NOTE: this `.md` only chooses the component reference; the component's branding lives in its `styles.module.css` and is handled by the "brand the 3 restored components" workstream below (unlike #7/#8, which are component source files where main's data + branding restyle merge in-file).
5. `docs/llm-inference-basics/what-is-llm-inference.md` — keep branding `<ContactSection />` (main left `<Newsletter />` = base).
6. `src/components/Banner/index.tsx` — delete (branding replaced Banner w/ MarketingHeader). Verify no dangling refs via build (main theme files `DocItem/Layout`, `Layout`, `DocCategoryGeneratedIndexPage` referenced it; branding deleted/rewrote those — confirm).
7. `src/components/GPUTable/index.tsx` — merge: keep main's GPU-interconnect column/data (#147) AND branding restyle.
8. `src/components/ModelExplorer/index.tsx` — merge: keep main's GLM-5.2 + M3 model data (#145) AND branding restyle.

## Workstream: brand the 3 restored components

Convert hardcoded hexes in each `styles.module.css` to `--Elements-*` tokens, mirroring
`src/components/AutoregressiveDecodeStepper/styles.module.css`.

| Old (role) | -> Brand token |
| --- | --- |
| Text `#111827` / `#374151` / `#6b7280` / `#9ca3af` | `--Elements-Twilight-100` / `-70` / `-60` / `-50` |
| Borders `#e5e7eb` / `#d1d5db` | `--Elements-Twilight-20` / `-30` |
| Surfaces `#fff` / `#f9fafb` / `#f3f4f6` | `--Elements-Twilight-0-100` / `-1` / `-5` |
| Primary/active green `#15803d`,`#166534` & blue `#1e40af`,`#3b82f6` | `--Elements-Neb-Ultra` (`#637bff`), hover `--Elements-Neb-Compl` |
| Light accent fills `#f0fdf4`,`#bbf7d0`,`#eff6ff` | `--Elements-Neb-20` / `-40` tints |

Open design point (resolve via annotate-ui): components use green AND blue as two accent roles;
brand has one accent => collapse onto Nebula (likely blue->Neb-Ultra, green->Neb tint or Twilight).

Files: `src/components/{LatencyTimelineVisualizer,TopPvsTopK,LLMLifecycleMap}/styles.module.css`.

## Execution steps

1. `git switch -c modular-branding-rebased` (from `modular-branding` @ e0588c8). Leaves `modular-branding` untouched.
2. Reproduce forced-base merge in scratch: `BRAND_ON_FORK=$(git commit-tree HEAD^{tree} -p 6570eb5 -m wip)`; `git switch --detach $BRAND_ON_FORK`; `git merge --no-commit 9cf5047`.
3. Resolve the 8 conflicts per table; `git rm src/components/Banner/index.tsx` (+ its styles if present).
4. Restyle the 3 components' `styles.module.css` per mapping table.
5. Capture resolved tree (`FINAL_TREE=$(git write-tree)` after staging), then on `modular-branding-rebased`: `git read-tree -u --reset $FINAL_TREE` and commit additively (parent = e0588c8). Message: "Pull latest main into rebrand: restore copy edits, restore + brand new components (LatencyTimelineVisualizer, TopPvsTopK, LLMLifecycleMap)".
6. `npm run build`; fix any broken imports/links (esp. Banner refs, image paths). Then `npm run serve`.
7. Old-brand sweep: `rg -i "bentoml" docs src` — fix reintroduced brand text / stale `utm_source`, leaving intentional `bentoml.com` blog links (separate non-goal).
8. `annotate-ui` light-only on: `how-does-llm-inference-work`, `inference-parameters`, `training-inference-differences`, `what-is-llm-inference`, `choosing-the-right-inference-framework`, `choosing-the-right-gpu`, `calculating-gpu-memory-for-llms`, `inference-optimization`. Stage via the annotate-ui engine; wait for submitted zip; ingest; apply per-region fixes.

## Verification / testing

- `npm run build` clean (no missing-component/import errors, no broken-link failures).
- Spot-check copy edits present: vram doc "quick sizing shortcut"; tokenizer example uses GPT-5/"The quick brown fox" (not "BentoML supports custom LLM inference").
- `rg -i "bentoml" docs/` shows only intentional blog links.
- The 3 components render in brand palette (Twilight/Nebula), no leftover green/old-blue.
- User annotate-ui pass clean.

## Grill Bill workflow

Route: tenacious-only. Sequence followed: challenged the request (rebase was a no-op; found the
real content-deletion problem); cut unnecessary work (no whole-history rewrite; additive commit
only); simplified (git-native forced-base merge instead of manual 44-file edits); scoped fastest
validating version (build + annotate-ui); inventoried uncertainties (fork point pinned to 6570eb5;
8 conflicts enumerated from a real simulated merge; component-styling gap discovered and resolved
to option A); executed only after approval.

## Skills required for execution

- `git-rebase`
- `inspect-rendered-ui`
- `annotate-ui`
- `git-commit`

## Deferred work / non-goals

- The rebrand's other stale `bentoml.com` links (branding-completeness pass) — separate task.
- Replacing `modular-branding` with `modular-branding-rebased` or pushing — user decides after review.
- Dark mode (disabled in config) — not reviewed.

## Execution options

- Execute inline.
- Execute with `executing-plans` (larger multi-step).
- Stop here.

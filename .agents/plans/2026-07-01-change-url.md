# Port URL config change from `modular-branding`

## Goal
Update this branch's Docusaurus site URL from `https://bentoml.com/llm/` to `https://handbook.modular.com/`, matching only the URL-related portion of the `modular-branding` rebrand — not the full rebrand.

## Refined problem statement
The `modular-branding` branch contains a large rebrand commit (`1f30c45 feat: rebrand handbook for Modular`) that rewrites `docusaurus.config.ts` almost entirely (theming, nav, footer, plugins, markdown format, etc.). Within that diff, only a small, well-defined slice is the actual site URL migration. The user wants that slice ported into this branch in isolation, without pulling in the rest of the rebrand.

## Chosen approach
Manually apply just the URL-related config keys to `docusaurus.config.ts`, plus add the `static/CNAME` file needed for GitHub Pages to actually serve the custom domain, rather than cherry-picking or merging the full rebrand commit (which would pull in unrelated theming/branding changes).

## Key constraints and assumptions
- Only `url`, `baseUrl`, and `trailingSlash` in `docusaurus.config.ts` are in scope, plus the new `static/CNAME` file.
- Other `bentoml.com/llm` references in `README.md`, `docs/model-interaction/structured-outputs.md`, and `docs/inference-optimization/llm-performance-benchmarks.md` are explicitly out of scope (content/link references, not the "docusaurus URL" config).
- All theming/branding/nav/footer/plugin changes from `modular-branding`'s rebrand commit are explicitly out of scope.
- No hardcoded `/llm/` internal paths exist elsewhere in the codebase that depend on the old `baseUrl` (verified via repo-wide search; the only other `/llm/` hits are an unrelated NVIDIA docs link and the already-excluded bentoml.com/llm references).
- Actually making `handbook.modular.com` resolve requires DNS + GitHub repo Pages custom-domain settings outside this repo; that is not part of this change.

## Discovery summary
- Diffed `docusaurus.config.ts` between `main` and `modular-branding` to isolate the exact source hunk for the URL change.
- Searched the repo for other `bentoml.com/llm` and `/llm/` references to confirm scope boundaries and rule out breakage from the `baseUrl` change.
- Checked `modular-branding`'s `static/CNAME` (contains `handbook.modular.com`) and confirmed this branch currently has no CNAME file at all.
- Asked the user whether to port just `url`/`baseUrl`, add `trailingSlash: true` (bundled in the same source diff hunk), or also add the `static/CNAME` file for a functionally complete change. User chose the fullest option: `url` + `baseUrl` + `trailingSlash` + `static/CNAME`.
- No remaining unknowns that would change the approach.

## Likely files affected
- `docusaurus.config.ts` (modify)
- `static/CNAME` (new file)

## Resolved operational details
- `docusaurus.config.ts` line ~20: `url: 'https://bentoml.com/'` → `url: 'https://handbook.modular.com'`
- `docusaurus.config.ts` line ~23: `baseUrl: '/llm/'` → `baseUrl: '/'`
- `docusaurus.config.ts` line ~29: `trailingSlash: false` → `trailingSlash: true`
- New file `static/CNAME` with exact contents: `handbook.modular.com`
- Boilerplate comments above `url`/`baseUrl` in the current file are left untouched (not part of the value change).

## User-provided prerequisites / needed from you before implementation
- Nothing blocking implementation of the code change itself.
- Follow-up outside this repo (not part of this plan): DNS records and the GitHub repository's Pages custom-domain setting need to point to `handbook.modular.com` for the domain to actually resolve once this is deployed.

## Grill Bill workflow
Route: tenacious-only. Investigated the source commit and repo directly (diffed configs, searched for dependent references) before proposing any plan. Asked one targeted scoping question to resolve genuine ambiguity (whether to include `trailingSlash` and `static/CNAME`) rather than guessing. No creative/product exploration was needed since the request was already concrete and mechanical.

## Skills required for execution
None beyond standard editing — this is a non-visual config change (no rendered UI to verify with `inspect-rendered-ui`), and no commit/PR was requested yet.

## Step-by-step implementation plan
1. Edit `docusaurus.config.ts`: change `url`, `baseUrl`, and `trailingSlash` values as specified above.
2. Create `static/CNAME` with contents `handbook.modular.com`.
3. Show the user a diff of both changes for review.

## Verification/testing expectations
Pure config/content change; no automated test suite covers this. Verification is via diff review of the two files. No build/dev-server run was requested or required.

## Deferred work / non-goals
- Full rebrand (theming, nav, footer, plugins, markdown format) from `modular-branding` — explicitly out of scope.
- Updating `bentoml.com/llm` references in `README.md`, `structured-outputs.md`, and `llm-performance-benchmarks.md` — explicitly out of scope.
- DNS / GitHub Pages custom-domain configuration outside the repo.

## Execution options
- Execute inline now.
- Execute via `executing-plans` (unnecessary here given the small size).
- Stop here.
